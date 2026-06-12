import Foundation
import Speech

for locale in SFSpeechRecognizer.supportedLocales().sorted(by: { $0.identifier < $1.identifier }) {
    if let recognizer = SFSpeechRecognizer(locale: locale) {
        if #available(macOS 10.15, *) {
            print("\(locale.identifier)\t\(recognizer.supportsOnDeviceRecognition)")
        } else {
            print("\(locale.identifier)\tunknown")
        }
    }
}
