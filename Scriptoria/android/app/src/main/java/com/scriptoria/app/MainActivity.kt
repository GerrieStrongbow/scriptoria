package com.scriptoria.app

import android.content.res.Resources
import android.os.Build
import android.os.Bundle
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Scriptoria"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Enable edge-to-edge displays for Android 15+ compatibility
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      WindowCompat.setDecorFitsSystemWindows(window, false)
    }
  }

  override fun getResources(): Resources {
    val resources = super.getResources()
    val configuration = resources.configuration
    
    // Force font scale to 1.0 to prevent system scaling from affecting UI
    if (configuration.fontScale != 1.0f) {
      configuration.fontScale = 1.0f
      resources.updateConfiguration(configuration, resources.displayMetrics)
    }
    
    return resources
  }
}