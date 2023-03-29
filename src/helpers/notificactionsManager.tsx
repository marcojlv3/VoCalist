import PushNotification, { Importance } from 'react-native-push-notification';

export const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id', 
        channelName: 'My channel',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => {},
    );
  };

export const notificationHandler = (title:string, message:string) => {
    PushNotification.localNotification({
      id:0,
      channelId: 'channel-id',
      title: title,
      message: message,
      autoCancel: false,
      subText: 'Notification',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      ignoreInForeground: false,
      importance: 'high',
      invokeApp: true,
      allowWhileIdle: true,
      priority: 'high',
      visibility: 'public',
      ongoing: true
    });
    
  };

  export const clearNotification = () => {
    PushNotification.cancelAllLocalNotifications();
  }