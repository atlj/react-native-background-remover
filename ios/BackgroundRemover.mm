#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BackgroundRemover, NSObject)

RCT_EXTERN_METHOD(removeBackground: (NSString *) imageURI
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
