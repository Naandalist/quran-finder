# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ==================== App Classes ====================
-keep class com.naandalist.quran_finder.** { *; }

# ==================== React Native ====================
# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep native methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ==================== React Navigation ====================
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.rnscreens.** { *; }

# ==================== SQLite (Nitro) ====================
-keep class com.margelo.nitro.** { *; }
-keep class com.margelo.nitro.sqlite.** { *; }

# ==================== MMKV ====================
-keep class com.tencent.mmkv.** { *; }

# ==================== React Native Sound Player ====================
-keep class com.johnsonsu.rnsoundplayer.** { *; }

# ==================== React Native SVG ====================
-keep class com.horcrux.svg.** { *; }

# ==================== React Native FS ====================
-keep class com.rnfs.** { *; }

# ==================== Safe Area Context ====================
-keep class com.th3rdwave.safeareacontext.** { *; }

# ==================== Gesture Handler ====================
-keep class com.swmansion.gesturehandler.react.** { *; }

# ==================== General Android ====================
# Keep JavaScript interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Parcelable classes
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ==================== Debugging ====================
# Uncomment this to preserve line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable

# If you keep line numbers, uncomment this to hide original source file name
#-renamesourcefileattribute SourceFile
