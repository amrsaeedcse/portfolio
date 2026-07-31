# React Native Permissions Best Practices (Android 13+ / API 33+)

This document defines the modern, correct way to handle runtime permissions in React Native using the `react-native-permissions` package, with special focus on the storage permission changes introduced in Android 13 (API 33) and enforced in Android 14+.

---

## 1. The Old Way is BROKEN — Do NOT Use

```typescript
// ❌ WRONG — This does NOTHING on Android 13+
await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
```
`READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` are **ignored** by the system starting from Android 13. Requesting them will silently return `denied` without showing any dialog.

---

## 2. Modern Granular Media Permissions (Android 13+)

Android 13 replaced the broad `storage` permission with **granular per-type permissions**:

| Use Case | Permission | Manifest Entry |
|----------|-----------|----------------|
| Read Images | `PERMISSIONS.ANDROID.READ_MEDIA_IMAGES` | `android.permission.READ_MEDIA_IMAGES` |
| Read Videos | `PERMISSIONS.ANDROID.READ_MEDIA_VIDEO` | `android.permission.READ_MEDIA_VIDEO` |
| Read Audio | `PERMISSIONS.ANDROID.READ_MEDIA_AUDIO` | `android.permission.READ_MEDIA_AUDIO` |

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

### TypeScript Runtime Request Pattern:
```typescript
import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS, request, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

export async function requestStoragePermission(): Promise<boolean> {
  const sdkInt = await DeviceInfo.getApiLevel();

  if (sdkInt >= 33) {
    // Android 13+: Request specific media types needed
    const statuses = await requestMultiple([
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    ]);

    return Object.values(statuses).every((s) => s === RESULTS.GRANTED);
  } else if (sdkInt >= 30) {
    // Android 11-12: Scoped storage, request MANAGE_EXTERNAL_STORAGE if needed
    const status = await request(PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE);
    return status === RESULTS.GRANTED;
  } else {
    // Android 10 and below: Legacy storage permission
    const status = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return status === RESULTS.GRANTED;
  }
}
```

---

## 3. `MANAGE_EXTERNAL_STORAGE` — Use ONLY When Absolutely Required

This permission gives full read/write access to all files. **Google Play will reject your app** unless your core functionality is a file manager, backup tool, or antivirus.

```typescript
import { PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';

// Only use for apps that MUST access arbitrary file paths (e.g., download manager)
const status = await request(PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE);
if (status === RESULTS.BLOCKED) {
  // User must enable it manually in Settings
  await openSettings();
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

```typescript
// Must request before showing any notification
const status = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
```

**Manifest:**
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

---

## 5. Permission Check & Settings Redirect Pattern

Always provide a graceful fallback when the user permanently denies a permission:

```typescript
import { Permission, RESULTS, check, request, openSettings } from 'react-native-permissions';

export async function ensurePermissionOrRedirect(permission: Permission): Promise<void> {
  const status = await check(permission);

  if (status === RESULTS.GRANTED) return;

  if (status === RESULTS.BLOCKED) {
    // Show dialog explaining why, then open settings
    await openSettings();
    return;
  }

  // First-time or denied (not permanent) — request normally
  const result = await request(permission);
  if (result !== RESULTS.GRANTED) {
    throw new UnexpectedFailure('permission_denied');
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
