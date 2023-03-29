import Sound from 'react-native-sound';

let sound: Sound;

export const playSound = (name: string) => {
    sound = new Sound(name, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log(error);
          return;
        }
        sound.play();
    });
}

export const stopSound = () => {
    if(sound)
        sound.stop();
}