# Permission Hooks

React Native permission hooks built on top of `react-native-permissions` for easy permission management in your app.

## Setup

Make sure you have `react-native-permissions` installed and configured in your project. Follow the [official setup guide](https://github.com/zoontek/react-native-permissions) for platform-specific configuration.

### iOS

Add permissions to your `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select images</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need location access to show nearby places</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access to record audio</string>
```

### Android

Add permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Available Hooks

### `usePermission`

Basic hook for managing a single permission.

```tsx
import { usePermission } from '@/hooks/usePermissions';
import { PERMISSIONS } from 'react-native-permissions';

function CameraScreen() {
  const camera = usePermission(PERMISSIONS.IOS.CAMERA);

  const takePicture = async () => {
    if (!camera.isGranted) {
      const result = await camera.request();
      if (result !== 'granted') return;
    }
    // Take picture
  };

  return (
    <View>
      <Text>Camera Status: {camera.status}</Text>
      <Button
        title="Take Picture"
        onPress={takePicture}
        disabled={camera.loading}
      />
    </View>
  );
}
```

### `useMultiplePermissions`

Hook for managing multiple permissions at once.

```tsx
import { useMultiplePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS } from 'react-native-permissions';

function MediaScreen() {
  const permissions = useMultiplePermissions([
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.PHOTO_LIBRARY,
    PERMISSIONS.IOS.MICROPHONE,
  ]);

  const startRecording = async () => {
    if (!permissions.allGranted) {
      await permissions.request();
    }

    if (permissions.allGranted) {
      // Start recording
    } else {
      Alert.alert('Permissions Required', 'Please grant all permissions to continue');
    }
  };

  return (
    <View>
      <Text>All Granted: {permissions.allGranted ? 'Yes' : 'No'}</Text>
      <Button
        title="Start Recording"
        onPress={startRecording}
        disabled={permissions.loading}
      />
    </View>
  );
}
```

### Specialized Hooks with Built-in Alerts

These hooks include user-friendly alerts when permissions are denied or blocked.

#### `useCameraPermission`

```tsx
import { useCameraPermission } from '@/hooks/usePermissions';

function CameraScreen() {
  const camera = useCameraPermission();

  const handleTakePicture = async () => {
    if (!camera.isGranted) {
      // This will show an alert if denied/blocked
      await camera.requestWithAlert();
    }

    if (camera.isGranted) {
      // Take picture
    }
  };

  return (
    <Button
      title="Take Picture"
      onPress={handleTakePicture}
      disabled={camera.loading}
    />
  );
}
```

#### `usePhotoLibraryPermission`

```tsx
import { usePhotoLibraryPermission } from '@/hooks/usePermissions';

function GalleryScreen() {
  const gallery = usePhotoLibraryPermission();

  const selectImage = async () => {
    if (!gallery.isGranted) {
      await gallery.requestWithAlert();
    }

    if (gallery.isGranted) {
      // Open image picker
    }
  };

  return (
    <Button
      title="Select Image"
      onPress={selectImage}
      disabled={gallery.loading}
    />
  );
}
```

#### `useLocationPermission`

```tsx
import { useLocationPermission } from '@/hooks/usePermissions';

function MapScreen() {
  const location = useLocationPermission('whenInUse'); // or 'always'

  const getCurrentLocation = async () => {
    if (!location.isGranted) {
      await location.requestWithAlert();
    }

    if (location.isGranted) {
      // Get location
    }
  };

  return (
    <Button
      title="Get Location"
      onPress={getCurrentLocation}
      disabled={location.loading}
    />
  );
}
```

#### `useMicrophonePermission`

```tsx
import { useMicrophonePermission } from '@/hooks/usePermissions';

function RecordingScreen() {
  const microphone = useMicrophonePermission();

  const startRecording = async () => {
    if (!microphone.isGranted) {
      await microphone.requestWithAlert();
    }

    if (microphone.isGranted) {
      // Start recording
    }
  };

  return (
    <Button
      title="Start Recording"
      onPress={startRecording}
      disabled={microphone.loading}
    />
  );
}
```

#### `useNotificationPermission`

```tsx
import { useNotificationPermission } from '@/hooks/usePermissions';

function SettingsScreen() {
  const notifications = useNotificationPermission();

  const enableNotifications = async () => {
    await notifications.requestWithAlert();
  };

  return (
    <View>
      <Text>Notifications: {notifications.isGranted ? 'Enabled' : 'Disabled'}</Text>
      <Button
        title="Enable Notifications"
        onPress={enableNotifications}
        disabled={notifications.loading}
      />
    </View>
  );
}
```

#### `useContactsPermission`

```tsx
import { useContactsPermission } from '@/hooks/usePermissions';

function ContactsScreen() {
  const contacts = useContactsPermission();

  const loadContacts = async () => {
    if (!contacts.isGranted) {
      await contacts.requestWithAlert();
    }

    if (contacts.isGranted) {
      // Load contacts
    }
  };

  return (
    <Button
      title="Load Contacts"
      onPress={loadContacts}
      disabled={contacts.loading}
    />
  );
}
```

## Utility Functions

You can also use utility functions for more control:

```tsx
import {
  CommonPermissions,
  isPermissionGranted,
  requestPermissionWithAlert,
  ensurePermission,
  ensureMultiplePermissions,
  showPermissionSettingsAlert,
} from '@/utils/permissions';

// Check if permission is granted
const hasCamera = await isPermissionGranted(CommonPermissions.CAMERA);

// Request with automatic alert handling
await requestPermissionWithAlert(CommonPermissions.CAMERA);

// Ensure permission (request only if not granted)
const granted = await ensurePermission(CommonPermissions.CAMERA);

// Ensure multiple permissions
const allGranted = await ensureMultiplePermissions([
  CommonPermissions.CAMERA,
  CommonPermissions.MICROPHONE,
]);

// Show settings alert manually
showPermissionSettingsAlert('Camera', 'Please enable camera access in Settings');
```

## Custom Permission Request

Create a custom permission request with custom messaging:

```tsx
import { createPermissionRequest, CommonPermissions } from '@/utils/permissions';

const requestCamera = createPermissionRequest(CommonPermissions.CAMERA, {
  title: 'Camera Access',
  message: 'We need access to your camera to take profile pictures',
  blockedTitle: 'Camera Blocked',
  blockedMessage: 'Camera access is blocked. Please enable it in Settings to take photos.',
  onGranted: () => console.log('Camera granted'),
  onDenied: () => console.log('Camera denied'),
  onBlocked: () => console.log('Camera blocked'),
});

// Use it
await requestCamera();
```

## API Reference

### `usePermission` Return Values

| Property | Type | Description |
|----------|------|-------------|
| `status` | `PermissionStatus \| null` | Current permission status |
| `isGranted` | `boolean` | Whether permission is granted |
| `isDenied` | `boolean` | Whether permission is denied |
| `isBlocked` | `boolean` | Whether permission is blocked |
| `isUnavailable` | `boolean` | Whether permission is unavailable |
| `isLimited` | `boolean` | Whether permission is limited (iOS 14+) |
| `request` | `() => Promise<PermissionStatus>` | Request the permission |
| `check` | `() => Promise<PermissionStatus>` | Check permission status |
| `openSettings` | `() => Promise<void>` | Open app settings |
| `loading` | `boolean` | Whether a request/check is in progress |

### `useMultiplePermissions` Return Values

| Property | Type | Description |
|----------|------|-------------|
| `statuses` | `Record<Permission, PermissionStatus>` | Status for each permission |
| `allGranted` | `boolean` | Whether all permissions are granted |
| `anyDenied` | `boolean` | Whether any permission is denied |
| `anyBlocked` | `boolean` | Whether any permission is blocked |
| `request` | `() => Promise<Record<Permission, PermissionStatus>>` | Request all permissions |
| `check` | `() => Promise<Record<Permission, PermissionStatus>>` | Check all permissions |
| `openSettings` | `() => Promise<void>` | Open app settings |
| `loading` | `boolean` | Whether a request/check is in progress |

### Permission Status Values

- `'granted'` - Permission is granted
- `'denied'` - Permission is denied
- `'blocked'` - Permission is permanently blocked
- `'unavailable'` - Permission is not available on this device
- `'limited'` - Permission is granted with limitations (iOS 14+)

## Best Practices

1. **Check before requesting**: Always check if permission is already granted before requesting
2. **Handle blocked state**: Provide a way to open settings when permission is blocked
3. **Auto-check on mount**: Use `autoCheck: true` (default) to automatically check permission status on component mount
4. **User-friendly messages**: Use the specialized hooks (`useCameraPermission`, etc.) for better UX with built-in alerts
5. **Request at the right time**: Request permissions when the user is about to use the feature, not on app launch
6. **Explain why**: Always explain why you need the permission before requesting it

## Example: Complete Camera Flow

```tsx
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { useCameraPermission } from '@/hooks/usePermissions';
import { Text } from '@/components/ui';

function CameraFeature() {
  const camera = useCameraPermission();

  const handleTakePicture = async () => {
    // Check if already granted
    if (camera.isGranted) {
      takePicture();
      return;
    }

    // Request with alert
    const result = await camera.requestWithAlert();

    // Take picture if granted
    if (result === 'granted') {
      takePicture();
    }
  };

  const takePicture = () => {
    // Your camera logic here
    console.log('Taking picture...');
  };

  if (camera.loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Camera Status: {camera.status}</Text>
      <Button title="Take Picture" onPress={handleTakePicture} />

      {camera.isBlocked && (
        <Button
          title="Open Settings"
          onPress={camera.openSettings}
        />
      )}
    </View>
  );
}
```
