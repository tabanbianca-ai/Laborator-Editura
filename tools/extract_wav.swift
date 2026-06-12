import Foundation
import AVFoundation
import CoreMedia

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

guard CommandLine.arguments.count >= 3 else {
    fail("Usage: extract_wav.swift <input.mp4> <output.wav> [sample-rate] [channels]")
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

let asset = AVURLAsset(url: inputURL)
let tracks = asset.tracks(withMediaType: .audio)
guard let audioTrack = tracks.first else {
    fail("No audio track found")
}

let reader: AVAssetReader
do {
    reader = try AVAssetReader(asset: asset)
} catch {
    fail("Could not create reader: \(error.localizedDescription)")
}

let sampleRate = CommandLine.arguments.count >= 4 ? (Int(CommandLine.arguments[3]) ?? 22_050) : 22_050
let channels = CommandLine.arguments.count >= 5 ? (Int(CommandLine.arguments[4]) ?? 2) : 2
let bitsPerSample = 16

let outputSettings: [String: Any] = [
    AVFormatIDKey: kAudioFormatLinearPCM,
    AVSampleRateKey: sampleRate,
    AVNumberOfChannelsKey: channels,
    AVLinearPCMBitDepthKey: bitsPerSample,
    AVLinearPCMIsFloatKey: false,
    AVLinearPCMIsBigEndianKey: false,
    AVLinearPCMIsNonInterleaved: false
]

let trackOutput = AVAssetReaderTrackOutput(track: audioTrack, outputSettings: outputSettings)
trackOutput.alwaysCopiesSampleData = false

guard reader.canAdd(trackOutput) else {
    fail("Could not add audio track output")
}
reader.add(trackOutput)

guard reader.startReading() else {
    if let error = reader.error as NSError? {
        fail("Could not start reading: \(error.domain) \(error.code) \(error.localizedDescription) \(error.userInfo)")
    }
    fail("Could not start reading: unknown error")
}

var pcm = Data()

while let sampleBuffer = trackOutput.copyNextSampleBuffer() {
    guard let blockBuffer = CMSampleBufferGetDataBuffer(sampleBuffer) else {
        continue
    }

    var totalLength = 0
    var pointer: UnsafeMutablePointer<Int8>?
    let status = CMBlockBufferGetDataPointer(
        blockBuffer,
        atOffset: 0,
        lengthAtOffsetOut: nil,
        totalLengthOut: &totalLength,
        dataPointerOut: &pointer
    )

    if status == kCMBlockBufferNoErr, let pointer {
        let bytes = UnsafeRawPointer(pointer).assumingMemoryBound(to: UInt8.self)
        pcm.append(bytes, count: totalLength)
    }
}

if reader.status == .failed || reader.status == .cancelled {
    if let error = reader.error as NSError? {
        fail("Reader failed: \(error.domain) \(error.code) \(error.localizedDescription) \(error.userInfo)")
    }
    fail("Reader failed: unknown error")
}

func appendString(_ string: String, to data: inout Data) {
    data.append(string.data(using: .ascii)!)
}

func appendUInt16LE(_ value: UInt16, to data: inout Data) {
    var little = value.littleEndian
    withUnsafeBytes(of: &little) { data.append(contentsOf: $0) }
}

func appendUInt32LE(_ value: UInt32, to data: inout Data) {
    var little = value.littleEndian
    withUnsafeBytes(of: &little) { data.append(contentsOf: $0) }
}

var wav = Data()
let byteRate = sampleRate * channels * bitsPerSample / 8
let blockAlign = channels * bitsPerSample / 8

appendString("RIFF", to: &wav)
appendUInt32LE(UInt32(36 + pcm.count), to: &wav)
appendString("WAVE", to: &wav)
appendString("fmt ", to: &wav)
appendUInt32LE(16, to: &wav)
appendUInt16LE(1, to: &wav)
appendUInt16LE(UInt16(channels), to: &wav)
appendUInt32LE(UInt32(sampleRate), to: &wav)
appendUInt32LE(UInt32(byteRate), to: &wav)
appendUInt16LE(UInt16(blockAlign), to: &wav)
appendUInt16LE(UInt16(bitsPerSample), to: &wav)
appendString("data", to: &wav)
appendUInt32LE(UInt32(pcm.count), to: &wav)
wav.append(pcm)

do {
    try wav.write(to: outputURL, options: .atomic)
} catch {
    fail("Could not write WAV: \(error.localizedDescription)")
}

print("Wrote \(outputURL.path) (\(pcm.count) PCM bytes)")
