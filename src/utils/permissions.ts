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

/**
 * Common permission types for easy reference
 */
export const CommonPermissions = {
  CAMERA: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }) as Permission,

  PHOTO_LIBRARY: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  }) as Permission,

  LOCATION_WHEN_IN_USE: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  }) as Permission,

  LOCATION_ALWAYS: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  }) as Permission,

  MICROPHONE: Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }) as Permission,

  NOTIFICATIONS: Platform.select({
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
  }) as Permission,

  CONTACTS: Platform.select({
    ios: PERMISSIONS.IOS.CONTACTS,
    android: PERMISSIONS.ANDROID.READ_CONTACTS,
  }) as Permission,

  CALENDAR: Platform.select({
    ios: PERMISSIONS.IOS.CALENDARS,
    android: PERMISSIONS.ANDROID.READ_CALENDAR,
  }) as Permission,

  BLUETOOTH: Platform.select({
    ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    android: PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  }) as Permission,
};

/**
 * Helper function to get user-friendly permission names
 */
export const getPermissionName = (permission: Permission): string => {
  const permissionMap: Record<string, string> = {
    [CommonPermissions.CAMERA]: 'Camera',
    [CommonPermissions.PHOTO_LIBRARY]: 'Photo Library',
    [CommonPermissions.LOCATION_WHEN_IN_USE]: 'Location',
    [CommonPermissions.LOCATION_ALWAYS]: 'Location (Always)',
    [CommonPermissions.MICROPHONE]: 'Microphone',
    [CommonPermissions.NOTIFICATIONS]: 'Notifications',
    [CommonPermissions.CONTACTS]: 'Contacts',
    [CommonPermissions.CALENDAR]: 'Calendar',
    [CommonPermissions.BLUETOOTH]: 'Bluetooth',
  };

  return permissionMap[permission] || 'Permission';
};

/**
 * Check if a permission is granted
 */
export const isPermissionGranted = async (permission: Permission): Promise<boolean> => {
  const status = await check(permission);
  return status === RESULTS.GRANTED;
};

/**
 * Check if a permission is blocked
 */
export const isPermissionBlocked = async (permission: Permission): Promise<boolean> => {
  const status = await check(permission);
  return status === RESULTS.BLOCKED;
};

/**
 * Request a permission with automatic alert handling
 */
export const requestPermissionWithAlert = async (
  permission: Permission,
  options?: {
    title?: string;
    message?: string;
    blockedTitle?: string;
    blockedMessage?: string;
  }
): Promise<PermissionStatus> => {
  const permissionName = getPermissionName(permission);
  const status = await request(permission);

  if (status === RESULTS.BLOCKED) {
    Alert.alert(
      options?.blockedTitle || `${permissionName} Permission Required`,
      options?.blockedMessage ||
        `${permissionName} access has been blocked. Please enable it in Settings to use this feature.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ]
    );
  } else if (status === RESULTS.DENIED) {
    Alert.alert(
      options?.title || `${permissionName} Permission Required`,
      options?.message || `${permissionName} access is required to use this feature.`,
      [{ text: 'OK' }]
    );
  }

  return status;
};

/**
 * Request multiple permissions and return which ones were granted
 */
export const requestPermissionsWithStatus = async (
  permissions: Permission[]
): Promise<{
  granted: Permission[];
  denied: Permission[];
  blocked: Permission[];
  statuses: Record<Permission, PermissionStatus>;
}> => {
  const statuses = await requestMultiple(permissions);

  const granted: Permission[] = [];
  const denied: Permission[] = [];
  const blocked: Permission[] = [];

  Object.entries(statuses).forEach(([permission, status]) => {
    if (status === RESULTS.GRANTED) {
      granted.push(permission as Permission);
    } else if (status === RESULTS.DENIED) {
      denied.push(permission as Permission);
    } else if (status === RESULTS.BLOCKED) {
      blocked.push(permission as Permission);
    }
  });

  return { granted, denied, blocked, statuses };
};

/**
 * Check if all permissions in a list are granted
 */
export const areAllPermissionsGranted = async (permissions: Permission[]): Promise<boolean> => {
  const statuses = await checkMultiple(permissions);
  return Object.values(statuses).every(status => status === RESULTS.GRANTED);
};

/**
 * Get the status of multiple permissions
 */
export const getPermissionsStatus = async (
  permissions: Permission[]
): Promise<Record<Permission, PermissionStatus>> => {
  return await checkMultiple(permissions);
};

/**
 * Show a settings alert for a specific permission
 */
export const showPermissionSettingsAlert = (
  permissionName: string,
  message?: string
) => {
  Alert.alert(
    `${permissionName} Permission Required`,
    message || `Please enable ${permissionName} access in Settings to use this feature.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => openSettings() },
    ]
  );
};

/**
 * Request permission only if not already granted
 */
export const ensurePermission = async (permission: Permission): Promise<boolean> => {
  const status = await check(permission);

  if (status === RESULTS.GRANTED) {
    return true;
  }

  if (status === RESULTS.BLOCKED) {
    showPermissionSettingsAlert(getPermissionName(permission));
    return false;
  }

  const requestResult = await request(permission);
  return requestResult === RESULTS.GRANTED;
};

/**
 * Request multiple permissions only if not already granted
 */
export const ensureMultiplePermissions = async (
  permissions: Permission[]
): Promise<boolean> => {
  const statuses = await checkMultiple(permissions);

  // Check if all are already granted
  const allGranted = Object.values(statuses).every(status => status === RESULTS.GRANTED);
  if (allGranted) {
    return true;
  }

  // Check if any are blocked
  const anyBlocked = Object.entries(statuses).some(([_, status]) => status === RESULTS.BLOCKED);
  if (anyBlocked) {
    const blockedPermissions = Object.entries(statuses)
      .filter(([_, status]) => status === RESULTS.BLOCKED)
      .map(([permission]) => getPermissionName(permission as Permission))
      .join(', ');

    showPermissionSettingsAlert(
      'Permissions',
      `The following permissions are blocked: ${blockedPermissions}. Please enable them in Settings.`
    );
    return false;
  }

  // Request permissions that are not granted
  const permissionsToRequest = Object.entries(statuses)
    .filter(([_, status]) => status !== RESULTS.GRANTED)
    .map(([permission]) => permission as Permission);

  if (permissionsToRequest.length === 0) {
    return true;
  }

  const requestResults = await requestMultiple(permissionsToRequest);
  return Object.values(requestResults).every(status => status === RESULTS.GRANTED);
};

/**
 * Utility to create a custom permission request with custom messaging
 */
export const createPermissionRequest = (
  permission: Permission,
  config: {
    title: string;
    message: string;
    blockedTitle?: string;
    blockedMessage?: string;
    onGranted?: () => void;
    onDenied?: () => void;
    onBlocked?: () => void;
  }
) => {
  return async (): Promise<PermissionStatus> => {
    const status = await request(permission);

    switch (status) {
      case RESULTS.GRANTED:
        config.onGranted?.();
        break;

      case RESULTS.DENIED:
        config.onDenied?.();
        Alert.alert(config.title, config.message, [{ text: 'OK' }]);
        break;

      case RESULTS.BLOCKED:
        config.onBlocked?.();
        Alert.alert(
          config.blockedTitle || config.title,
          config.blockedMessage ||
            `${getPermissionName(permission)} access has been blocked. Please enable it in Settings.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
        break;
    }

    return status;
  };
};

/**
 * Export permission results for easy reference
 */
export { RESULTS as PermissionResults };

/**
 * Export all PERMISSIONS from react-native-permissions
 */
export { PERMISSIONS };
