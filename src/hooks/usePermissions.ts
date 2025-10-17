import { useState, useEffect, useCallback } from 'react';
import {
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
  check,
  request,
  checkMultiple,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

export type PermissionResult = PermissionStatus;

export interface UsePermissionReturn {
  status: PermissionStatus | null;
  isGranted: boolean;
  isDenied: boolean;
  isBlocked: boolean;
  isUnavailable: boolean;
  isLimited: boolean;
  request: () => Promise<PermissionStatus>;
  check: () => Promise<PermissionStatus>;
  openSettings: () => Promise<void>;
  loading: boolean;
}

export interface UseMultiplePermissionsReturn {
  statuses: Record<Permission, PermissionStatus>;
  allGranted: boolean;
  anyDenied: boolean;
  anyBlocked: boolean;
  request: () => Promise<Record<Permission, PermissionStatus>>;
  check: () => Promise<Record<Permission, PermissionStatus>>;
  openSettings: () => Promise<void>;
  loading: boolean;
}

/**
 * Hook to manage a single permission
 * @param permission - The permission to check/request
 * @param autoCheck - Whether to automatically check permission on mount (default: true)
 */
export const usePermission = (
  permission: Permission,
  autoCheck: boolean = true
): UsePermissionReturn => {
  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
    setLoading(true);
    try {
      const result = await check(permission);
      setStatus(result);
      return result;
    } catch (error) {
      console.error('Error checking permission:', error);
      return RESULTS.UNAVAILABLE;
    } finally {
      setLoading(false);
    }
  }, [permission]);

  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    setLoading(true);
    try {
      const result = await request(permission);
      setStatus(result);
      return result;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return RESULTS.UNAVAILABLE;
    } finally {
      setLoading(false);
    }
  }, [permission]);

  const handleOpenSettings = useCallback(async () => {
    await openSettings();
  }, []);

  useEffect(() => {
    if (autoCheck) {
      checkPermission();
    }
  }, [autoCheck, checkPermission]);

  return {
    status,
    isGranted: status === RESULTS.GRANTED,
    isDenied: status === RESULTS.DENIED,
    isBlocked: status === RESULTS.BLOCKED,
    isUnavailable: status === RESULTS.UNAVAILABLE,
    isLimited: status === RESULTS.LIMITED,
    request: requestPermission,
    check: checkPermission,
    openSettings: handleOpenSettings,
    loading,
  };
};

/**
 * Hook to manage multiple permissions
 * @param permissions - Array of permissions to check/request
 * @param autoCheck - Whether to automatically check permissions on mount (default: true)
 */
export const useMultiplePermissions = (
  permissions: Permission[],
  autoCheck: boolean = true
): UseMultiplePermissionsReturn => {
  const [statuses, setStatuses] = useState<Record<Permission, PermissionStatus>>({} as Record<Permission, PermissionStatus>);
  const [loading, setLoading] = useState<boolean>(false);

  const checkPermissions = useCallback(async (): Promise<Record<Permission, PermissionStatus>> => {
    setLoading(true);
    try {
      const results = await checkMultiple(permissions);
      setStatuses(results);
      return results;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {} as Record<Permission, PermissionStatus>;
    } finally {
      setLoading(false);
    }
  }, [permissions]);

  const requestPermissions = useCallback(async (): Promise<Record<Permission, PermissionStatus>> => {
    setLoading(true);
    try {
      const results = await requestMultiple(permissions);
      setStatuses(results);
      return results;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return {} as Record<Permission, PermissionStatus>;
    } finally {
      setLoading(false);
    }
  }, [permissions]);

  const handleOpenSettings = useCallback(async () => {
    await openSettings();
  }, []);

  useEffect(() => {
    if (autoCheck && permissions.length > 0) {
      checkPermissions();
    }
  }, [autoCheck, checkPermissions, permissions.length]);

  const allGranted = Object.values(statuses).every(status => status === RESULTS.GRANTED);
  const anyDenied = Object.values(statuses).some(status => status === RESULTS.DENIED);
  const anyBlocked = Object.values(statuses).some(status => status === RESULTS.BLOCKED);

  return {
    statuses,
    allGranted,
    anyDenied,
    anyBlocked,
    request: requestPermissions,
    check: checkPermissions,
    openSettings: handleOpenSettings,
    loading,
  };
};

/**
 * Hook for camera permission with user-friendly alerts
 */
export const useCameraPermission = () => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }) as Permission;

  const permissionHook = usePermission(permission);

  const requestWithAlert = useCallback(async () => {
    const result = await permissionHook.request();

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Camera Permission Required',
        'Camera access has been blocked. Please enable it in Settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => permissionHook.openSettings() },
        ]
      );
    } else if (result === RESULTS.DENIED) {
      Alert.alert(
        'Camera Permission Required',
        'Camera access is required to use this feature.',
        [{ text: 'OK' }]
      );
    }

    return result;
  }, [permissionHook]);

  return {
    ...permissionHook,
    requestWithAlert,
  };
};

/**
 * Hook for photo library permission with user-friendly alerts
 */
export const usePhotoLibraryPermission = () => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  }) as Permission;

  const permissionHook = usePermission(permission);

  const requestWithAlert = useCallback(async () => {
    const result = await permissionHook.request();

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Photo Library Permission Required',
        'Photo library access has been blocked. Please enable it in Settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => permissionHook.openSettings() },
        ]
      );
    } else if (result === RESULTS.DENIED) {
      Alert.alert(
        'Photo Library Permission Required',
        'Photo library access is required to use this feature.',
        [{ text: 'OK' }]
      );
    }

    return result;
  }, [permissionHook]);

  return {
    ...permissionHook,
    requestWithAlert,
  };
};

/**
 * Hook for location permission with user-friendly alerts
 */
export const useLocationPermission = (type: 'always' | 'whenInUse' = 'whenInUse') => {
  const permission = Platform.select({
    ios: type === 'always'
      ? PERMISSIONS.IOS.LOCATION_ALWAYS
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: type === 'always'
      ? PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  }) as Permission;

  const permissionHook = usePermission(permission);

  const requestWithAlert = useCallback(async () => {
    const result = await permissionHook.request();

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Location Permission Required',
        'Location access has been blocked. Please enable it in Settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => permissionHook.openSettings() },
        ]
      );
    } else if (result === RESULTS.DENIED) {
      Alert.alert(
        'Location Permission Required',
        'Location access is required to use this feature.',
        [{ text: 'OK' }]
      );
    }

    return result;
  }, [permissionHook]);

  return {
    ...permissionHook,
    requestWithAlert,
  };
};

/**
 * Hook for microphone permission with user-friendly alerts
 */
export const useMicrophonePermission = () => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }) as Permission;

  const permissionHook = usePermission(permission);

  const requestWithAlert = useCallback(async () => {
    const result = await permissionHook.request();

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Microphone Permission Required',
        'Microphone access has been blocked. Please enable it in Settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => permissionHook.openSettings() },
        ]
      );
    } else if (result === RESULTS.DENIED) {
      Alert.alert(
        'Microphone Permission Required',
        'Microphone access is required to use this feature.',
        [{ text: 'OK' }]
      );
    }

    return result;
  }, [permissionHook]);

  return {
    ...permissionHook,
    requestWithAlert,
  };
};

/**
 * Hook for notification permission with user-friendly alerts
 */
export const useNotificationPermission = () => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
  }) as Permission;

  const permissionHook = usePermission(permission);

  const requestWithAlert = useCallback(async () => {
    const result = await permissionHook.request();

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Notification Permission Required',
        'Notification access has been blocked. Please enable it in Settings to receive notifications.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => permissionHook.openSettings() },
        ]
      );
    } else if (result === RESULTS.DENIED) {
      Alert.alert(
        'Notification Permission Required',
        'Notification access is required to receive updates.',
        [{ text: 'OK' }]
      );
    }

    return result;
  }, [permissionHook]);

  return {
    ...permissionHook,
    requestWithAlert,
  };
};

/**
 * Hook for contacts permission with user-friendly alerts
 */
export const useContactsPermission = () => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.CONTACTS,
    android: PERMISSIONS.ANDROID.READ_CONTACTS,
  }) as Permission;

  const permissionHook = usePermission(permission);

  const requestWithAlert = useCallback(async () => {
    const result = await permissionHook.request();

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Contacts Permission Required',
        'Contacts access has been blocked. Please enable it in Settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => permissionHook.openSettings() },
        ]
      );
    } else if (result === RESULTS.DENIED) {
      Alert.alert(
        'Contacts Permission Required',
        'Contacts access is required to use this feature.',
        [{ text: 'OK' }]
      );
    }

    return result;
  }, [permissionHook]);

  return {
    ...permissionHook,
    requestWithAlert,
  };
};
