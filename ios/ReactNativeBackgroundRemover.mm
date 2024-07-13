#import "ReactNativeBackgroundRemover.h"
#import "ReactNativeBackgroundRemover-Swift.h"

@implementation BackgroundRemover {
  BackgroundRemoverSwift *backgroundRemover;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(removeBackground:(NSString *)imageURI
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [backgroundRemover removeBackground:imageURI resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBackgroundRemoverSpecJSI>(params);
}
#endif

@end
