import { Linking } from "react-native";

export function redirectPlayStore(){
    Linking.openURL("market://details?id=googoo.android.btgps");
}