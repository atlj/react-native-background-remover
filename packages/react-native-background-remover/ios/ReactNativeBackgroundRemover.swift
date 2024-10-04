import Vision
import CoreImage

public class BackgroundRemoverSwift: NSObject {
    
    @objc
    public func removeBackground(_ imageURI: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        #if targetEnvironment(simulator)
        reject("BackgroundRemover", "SimulatorError", NSError(domain: "BackgroundRemover", code: 2))
        return
        #endif

        if #available(iOS 15.0, *) {
            guard let url = URL(string: imageURI) else {
                reject("BackgroundRemover", "Invalid URL", NSError(domain: "BackgroundRemover", code: 3))
                return
            }
            
            guard let originalImage = CIImage(contentsOf: url, options: [.applyOrientationProperty: true]) else {
                reject("BackgroundRemover", "Unable to load image", NSError(domain: "BackgroundRemover", code: 4))
                return
            }
            
            let imageRequestHandler = VNImageRequestHandler(ciImage: originalImage)
            
            var segmentationRequest = VNGeneratePersonSegmentationRequest()
            segmentationRequest.qualityLevel = .accurate
            segmentationRequest.outputPixelFormat = kCVPixelFormatType_OneComponent8
            
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    try imageRequestHandler.perform([segmentationRequest])
                    guard let pixelBuffer = segmentationRequest.results?.first?.pixelBuffer else {
                        reject("BackgroundRemover", "No segmentation results", NSError(domain: "BackgroundRemover", code: 5))
                        return
                    }
                    
                    var maskImage = CIImage(cvPixelBuffer: pixelBuffer)
                    
                    // Adjust mask scaling
                    let scaleX = originalImage.extent.width / maskImage.extent.width
                    let scaleY = originalImage.extent.height / maskImage.extent.height
                    
                    maskImage = maskImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
                    
                    let maskedImage = originalImage.applyingFilter("CIBlendWithMask", parameters: [kCIInputMaskImageKey: maskImage])
                    
                    // Convert to UIImage via CGImage for better control
                    let context = CIContext()
                    guard let cgMaskedImage = context.createCGImage(maskedImage, from: maskedImage.extent) else {
                        reject("BackgroundRemover", "Error creating CGImage", NSError(domain: "BackgroundRemover", code: 6))
                        return
                    }
                    
                    let uiImage = UIImage(cgImage: cgMaskedImage)
                    
                    // Save the image as PNG to preserve transparency
                    let tempURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(url.lastPathComponent).appendingPathExtension("png")
                    if let data = uiImage.pngData() { // Use PNG to preserve transparency
                        try data.write(to: tempURL)
                        resolve(tempURL.absoluteString)
                    } else {
                        reject("BackgroundRemover", "Error saving image", NSError(domain: "BackgroundRemover", code: 7))
                    }
                    
                } catch {
                    reject("BackgroundRemover", "Error removing background", error)
                }
            }
        } else {
            reject("BackgroundRemover", "You need a device with iOS 15 or later", NSError(domain: "BackgroundRemover", code: 1))
        }
    }
}
