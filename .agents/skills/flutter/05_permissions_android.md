# Flutter Permissions Best Practices (Android 13+ / API 33+)

This document defines the modern, correct way to handle runtime permissions in Flutter using the `permission_handler` package, with special focus on the storage permission changes introduced in Android 13 (API 33) and enforced in Android 14+.

---

## 1. The Old Way is BROKEN — Do NOT Use

```dart
// ❌ WRONG — This does NOTHING on Android 13+
await Permission.storage.request();
```
`Permission.storage` maps to `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE`, which are **ignored** by the system starting from Android 13. Requesting them will silently return `denied` without showing any dialog.

---

## 2. Modern Granular Media Permissions (Android 13+)

Android 13 replaced the broad `storage` permission with **granular per-type permissions**:

| Use Case | Permission | Manifest Entry |
|----------|-----------|----------------|
| Read Images | `Permission.photos` | `android.permission.READ_MEDIA_IMAGES` |
| Read Videos | `Permission.videos` | `android.permission.READ_MEDIA_VIDEO` |
| Read Audio | `Permission.audio` | `android.permission.READ_MEDIA_AUDIO` |

### AndroidManifest.xml Setup:
```xml
<!-- For Android 13+ (API 33+): Granular Media Permissions -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

<!-- Fallback for Android 12 and below -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="29" />
```

### Dart Runtime Request Pattern:
```dart
import 'package:permission_handler/permission_handler.dart';
import 'package:device_info_plus/device_info_plus.dart';

Future<bool> requestStoragePermission() async {
  final deviceInfo = await DeviceInfoPlugin().androidInfo;
  final sdkInt = deviceInfo.version.sdkInt;

  if (sdkInt >= 33) {
    // Android 13+: Request specific media types needed
    final statuses = await [
      Permission.photos,
      Permission.videos,
      Permission.audio,
    ].request();

    return statuses.values.every((s) => s.isGranted);
  } else if (sdkInt >= 30) {
    // Android 11-12: Scoped storage, request manageExternalStorage if needed
    final status = await Permission.manageExternalStorage.request();
    return status.isGranted;
  } else {
    // Android 10 and below: Legacy storage permission
    final status = await Permission.storage.request();
    return status.isGranted;
  }
}
```

---

## 3. `manageExternalStorage` — Use ONLY When Absolutely Required

This permission gives full read/write access to all files. **Google Play will reject your app** unless your core functionality is a file manager, backup tool, or antivirus.

```dart
// Only use for apps that MUST access arbitrary file paths (e.g., download manager)
final status = await Permission.manageExternalStorage.request();
if (status.isPermanentlyDenied) {
  // User must enable it manually in Settings
  await openAppSettings();
}
```

**Manifest:**
```xml
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />
```

> ⚠️ You MUST fill out the "Permissions Declaration Form" in Google Play Console and justify why SAF/MediaStore is insufficient.

---

## 4. Notification Permission (Android 13+)

Starting Android 13, posting notifications requires explicit user consent:

```dart
// Must request before showing any notification
final status = await Permission.notification.request();
```

**Manifest:**
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

---

## 5. Permission Check & Settings Redirect Pattern

Always provide a graceful fallback when the user permanently denies a permission:

```dart
Future<void> ensurePermissionOrRedirect(Permission permission) async {
  final status = await permission.status;

  if (status.isGranted) return;

  if (status.isPermanentlyDenied) {
    // Show dialog explaining why, then open settings
    final opened = await openAppSettings();
    if (!opened) throw UnexpectedFailure(message: 'cannot_open_settings');
    return;
  }

  // First-time or denied (not permanent) — request normally
  final result = await permission.request();
  if (!result.isGranted) {
    throw UnexpectedFailure(message: 'permission_denied');
  }
}
```

---

## 6. Quick Reference Table

| Android Version | Storage Strategy | Key Permission |
|----------------|-----------------|----------------|
| **Android 14+ (API 34)** | Granular media only | `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` |
| **Android 13 (API 33)** | Granular media only | Same as above |
| **Android 11-12 (API 30-32)** | Scoped Storage | `MANAGE_EXTERNAL_STORAGE` (if needed) |
| **Android 10 (API 29)** | Scoped or Legacy | `READ_EXTERNAL_STORAGE` |
| **Android 9 and below** | Legacy | `READ_EXTERNAL_STORAGE` + `WRITE_EXTERNAL_STORAGE` |
