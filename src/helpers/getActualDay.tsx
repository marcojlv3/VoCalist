import {getFirstInstallTime} from 'react-native-device-info';

export function getActualDay() {
    return getFirstInstallTime().then((firstInstallTime) => {
        
        const currentDate = new Date();
        const installationDate = new Date(firstInstallTime);

        const milisDif = currentDate.getTime() - installationDate.getTime();


        const actualDay = Math.ceil(milisDif / 86400000);;
        return actualDay;
    });
}
