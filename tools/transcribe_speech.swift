import Foundation
import Speech

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

guard CommandLine.arguments.count >= 2 else {
    fail("Usage: transcribe_speech.swift <audio-or-video-file> [locale]")
}

let inputPath = CommandLine.arguments[1]
let localeID = CommandLine.arguments.count >= 3 ? CommandLine.arguments[2] : "es-ES"
let url = URL(fileURLWithPath: inputPath)

guard FileManager.default.fileExists(atPath: inputPath) else {
    fail("Input file does not exist: \(inputPath)")
}

guard let recognizer = SFSpeechRecognizer(locale: Locale(identifier: localeID)) else {
    fail("Speech recognizer is not available for locale \(localeID)")
}

if #available(macOS 10.15, *) {
    guard recognizer.supportsOnDeviceRecognition else {
        fail("On-device speech recognition is not available for locale \(localeID)")
    }
}

let authSemaphore = DispatchSemaphore(value: 0)
var authStatus: SFSpeechRecognizerAuthorizationStatus = .notDetermined

SFSpeechRecognizer.requestAuthorization { status in
    authStatus = status
    authSemaphore.signal()
}

_ = authSemaphore.wait(timeout: .now() + 30)

guard authStatus == .authorized else {
    fail("Speech recognition authorization status: \(authStatus.rawValue)")
}

let request = SFSpeechURLRecognitionRequest(url: url)
request.shouldReportPartialResults = false
if #available(macOS 10.15, *) {
    request.requiresOnDeviceRecognition = true
}

let recognitionSemaphore = DispatchSemaphore(value: 0)
var finalText = ""
var finalError: Error?

let task = recognizer.recognitionTask(with: request) { result, error in
    if let result = result {
        finalText = result.bestTranscription.formattedString
        if result.isFinal {
            recognitionSemaphore.signal()
        }
    }
    if let error = error {
        finalError = error
        recognitionSemaphore.signal()
    }
}

let waitResult = recognitionSemaphore.wait(timeout: .now() + 600)
task.cancel()

if waitResult == .timedOut {
    fail("Speech recognition timed out")
}

if let finalError = finalError, finalText.isEmpty {
    fail("Speech recognition failed: \(finalError.localizedDescription)")
}

print(finalText)
