# Add project specific ProGuard rules here.
-keepattributes *Annotation*,InnerClasses,Signature
-keep class com.eventmate.vip.** { *; }
-keepclassmembers class com.eventmate.vip.MainActivity$EventMateBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-dontwarn android.webkit.**
