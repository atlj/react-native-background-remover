import Vision
import CoreImage

public class BackgroundRemoverSwift: NSObject {
    
    @objc
    public func removeBackground(_ imageURI: String, redValue: Int, greenValue: Int, blueValue: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock)->Void {
        #if targetEnvironment(simulator)
        reject("BackgroundRemover", "SimulatorError", NSError(domain: "BackgroundRemover", code: 2))
            return
        #endif

        if #available(iOS 15.0, *) {
            let url = URL(string: imageURI)!
            let originalImage = CIImage(contentsOf: url, options: [.applyOrientationProperty: true])!
            let imageRequestHandler = VNImageRequestHandler(ciImage: originalImage)
            
            var segmentationRequest = VNGeneratePersonSegmentationRequest()
            segmentationRequest = VNGeneratePersonSegmentationRequest()
            segmentationRequest.qualityLevel = .accurate
            segmentationRequest.outputPixelFormat = kCVPixelFormatType_OneComponent8
            
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    try imageRequestHandler.perform([segmentationRequest])
                    let pixelBuffer =  segmentationRequest.results?.first!.pixelBuffer
                    
                    var maskImage = CIImage(cvPixelBuffer: pixelBuffer!)
                    
                    let scaleX = originalImage.extent.width / maskImage.extent.width
                    let scaleY = originalImage.extent.height / maskImage.extent.height
                    maskImage = maskImage.transformed(by: .init(scaleX: scaleX, y: scaleY))
                    
                    // Create a solid color background image
                    let backgroundColor = CIColor(red: CGFloat(redValue) / 255.0, green: CGFloat(greenValue) / 255.0, blue: CGFloat(blueValue) / 255.0)
                    let backgroundImage = CIImage(color: backgroundColor).cropped(to: originalImage.extent)
                    
                    let maskedImage = originalImage.applyingFilter("CIBlendWithMask", parameters: [kCIInputImageKey: originalImage,kCIInputMaskImageKey: maskImage])
                    
                    // Combine the masked image with the background
                    let finalImage = maskedImage.composited(over: backgroundImage)
                    
                    // Save the masked image to a temporary file
                    let tempURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(url.lastPathComponent)
                    let uiImage = UIImage(ciImage: finalImage)
                    if let data = uiImage.pngData() {
                        try data.write(to: tempURL)
                        resolve(tempURL.absoluteString)
                    }
                } catch {
                    reject("BackgroundRemover", "[ReactNativeBackgroundRemover]: Error removing background", error)
                }
            }
        } else {
            reject("BackgroundRemover", "[ReactNativeBackgroundRemover]: You need to have a device with at least iOS 15", NSError(domain: "BackgroundRemover", code: 1))
            return
        }
    }
}
