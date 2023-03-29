import { PermissionsAndroid, Platform } from "react-native";

export const recordAudioPermission = async () => {
  if (Platform.OS == 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    return (granted === PermissionsAndroid.RESULTS.GRANTED)
  } else {
    return true;
  }
};

export const recordNotificationPermission = async () => {
  if (Platform.OS == 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
    );
    return (granted === PermissionsAndroid.RESULTS.GRANTED)
  } else {
    return true;
  }
};


  
  
 
