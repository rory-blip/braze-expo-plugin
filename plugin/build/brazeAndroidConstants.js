"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANDROID_CONFIG_MAP = exports.BX_DRAWABLE = exports.BX_COLOR = exports.BX_BOOL = exports.BX_INT = exports.BX_STR = exports.ANDROID_BRAZE_XML_PATH = exports.BRAZE_SDK_REQUIRED_PERMISSIONS = exports.APP_LEVEL_GRADLE = exports.BUILDSCRIPT_LEVEL_GRADLE = exports.GRADLE_APPEND_ID = void 0;
exports.GRADLE_APPEND_ID = "expo-react-native-braze-sdk-import";
exports.BUILDSCRIPT_LEVEL_GRADLE = `
// start-${exports.GRADLE_APPEND_ID}
allprojects {
  repositories {
    maven { url "https://appboy.github.io/appboy-android-sdk/sdk" }
  }
}
buildscript {
    ext {
        // Set the kotlin version used in the Braze React SDK's buildscript
        if (findProperty('android.kotlinVersion')) {
            kotlin_version = findProperty('android.kotlinVersion')
        } else {
            kotlin_version = "1.8.10"
        }
    }
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version")
  }
}
// end-${exports.GRADLE_APPEND_ID}
`;
exports.APP_LEVEL_GRADLE = `
// start-${exports.GRADLE_APPEND_ID}
dependencies {
  if (project.getProperty('expo.braze.addFirebaseMessaging') == 'true') {
    def braze_fcm_version = findProperty('expo.braze.fcmVersion') ?: '23.0.0'
    implementation "com.google.firebase:firebase-messaging:$braze_fcm_version"
  }
}
// end-${exports.GRADLE_APPEND_ID}
`;
exports.BRAZE_SDK_REQUIRED_PERMISSIONS = [
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.INTERNET",
];
exports.ANDROID_BRAZE_XML_PATH = './android/app/src/main/res/values/braze.xml';
exports.BX_STR = "string";
exports.BX_INT = "integer";
exports.BX_BOOL = "bool";
exports.BX_COLOR = "color";
exports.BX_DRAWABLE = "drawable";
exports.ANDROID_CONFIG_MAP = {
    "androidApiKey": ["com_braze_api_key", exports.BX_STR],
    "baseUrl": ["com_braze_custom_endpoint", exports.BX_STR],
    "firebaseCloudMessagingSenderId": ["com_braze_firebase_cloud_messaging_sender_id", exports.BX_STR],
    "androidFirebaseMessagingFallbackServiceClasspath": ["com_braze_fallback_firebase_cloud_messaging_service_classpath", exports.BX_STR],
    "sessionTimeout": ["com_braze_session_timeout", exports.BX_INT],
    "logLevel": ["com_braze_logger_initial_log_level", exports.BX_INT],
    "minimumTriggerIntervalInSeconds": ["com_braze_trigger_action_minimum_time_interval_seconds", exports.BX_INT],
    "enableSdkAuthentication": ["com_braze_sdk_authentication_enabled", exports.BX_BOOL],
    "enableGeofence": ["com_braze_geofences_enabled", exports.BX_BOOL],
    "enableAutomaticLocationCollection": ["com_braze_enable_location_collection", exports.BX_BOOL],
    "enableAutomaticGeofenceRequests": ["com_braze_automatic_geofence_requests_enabled", exports.BX_BOOL],
    "enableFirebaseCloudMessaging": ["com_braze_firebase_cloud_messaging_registration_enabled", exports.BX_BOOL],
    "androidHandlePushDeepLinksAutomatically": ["com_braze_handle_push_deep_links_automatically", exports.BX_BOOL],
    "androidPushNotificationHtmlRenderingEnabled": ["com_braze_push_notification_html_rendering_enabled", exports.BX_BOOL],
    "androidFirebaseMessagingFallbackServiceEnabled": ["com_braze_fallback_firebase_cloud_messaging_service_enabled", exports.BX_BOOL],
    "androidNotificationSmallIcon": ["com_braze_push_small_notification_icon", exports.BX_DRAWABLE],
    "androidNotificationLargeIcon": ["com_braze_push_large_notification_icon", exports.BX_DRAWABLE],
    "androidNotificationAccentColor": ["com_braze_default_notification_accent_color", exports.BX_COLOR],
};
