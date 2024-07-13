package com.backgroundremover

import com.facebook.react.bridge.ReactApplicationContext

abstract class BackgroundRemoverSpec internal constructor(context: ReactApplicationContext) :
  NativeBackgroundRemoverSpec(context) {
}
