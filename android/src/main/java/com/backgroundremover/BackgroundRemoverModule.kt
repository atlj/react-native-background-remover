package com.backgroundremover

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ImageDecoder
import android.graphics.Paint
import android.graphics.PorterDuff
import android.graphics.PorterDuffXfermode
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.segmentation.Segmentation
import com.google.mlkit.vision.segmentation.Segmenter
import com.google.mlkit.vision.segmentation.selfie.SelfieSegmenterOptions
import java.io.File
import java.io.FileOutputStream
import java.net.URI
import kotlin.math.pow

class BackgroundRemoverModule internal constructor(context: ReactApplicationContext) :
  BackgroundRemoverSpec(context) {
  private var segmenter: Segmenter? = null

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun removeBackground(imageURI: String, promise: Promise) {
    val segmenter = this.segmenter ?: createSegmenter()
    val image = getImageBitmap(imageURI)

    val inputImage = InputImage.fromBitmap(image, 0)

    segmenter.process(inputImage).addOnFailureListener { e ->
      promise.reject(e)
    }.addOnSuccessListener { result ->
      val maskBuffer = result.buffer
      val mask = Bitmap.createBitmap(result.width, result.height, Bitmap.Config.ARGB_8888)

      for (y in 0 until result.height) {
        for (x in 0 until result.width) {
          val alpha = maskBuffer.getFloat().pow(4)
          mask.setPixel(x, y, Color.argb((alpha * 255).toInt(), 0, 0, 0))
        }
      }

      val paint = Paint(Paint.ANTI_ALIAS_FLAG)
      paint.setXfermode(PorterDuffXfermode(PorterDuff.Mode.DST_IN))
      val canvas = Canvas(image)
      canvas.drawBitmap(mask, 0f, 0f, paint)

      val fileName = URI(imageURI).path.split("/").last()
      val savedImageURI = saveImage(image, fileName)
      promise.resolve(savedImageURI)
    }
  }

  private fun createSegmenter(): Segmenter {
    val options =
      SelfieSegmenterOptions.Builder()
        .setDetectorMode(SelfieSegmenterOptions.SINGLE_IMAGE_MODE)
        .build()

    val segmenter = Segmentation.getClient(options)
    this.segmenter = segmenter

    return segmenter
  }

  private fun getImageBitmap(imageURI: String): Bitmap {
    val uri = Uri.parse(imageURI)

    val bitmap = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      ImageDecoder.decodeBitmap(
        ImageDecoder.createSource(
          reactApplicationContext.contentResolver,
          uri
        )
      ).copy(Bitmap.Config.ARGB_8888, true)
    } else {
      MediaStore.Images.Media.getBitmap(reactApplicationContext.contentResolver, uri)
    }

    return bitmap
  }

  private fun saveImage(bitmap: Bitmap, fileName: String): String {
    val file = File(reactApplicationContext.filesDir, fileName)
    val fileOutputStream = FileOutputStream(file)
    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fileOutputStream)
    fileOutputStream.close()
    return file.toURI().toString()
  }

  companion object {
    const val NAME = "BackgroundRemover"
  }
}
