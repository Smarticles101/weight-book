import crashlytics from "@react-native-firebase/crashlytics";
import { BannerAd, BannerAdSize } from "@react-native-admob/admob";
import React from "react";
import { Platform } from "react-native";

const adUnitID = __DEV__
  ? Platform.select({
      ios: "ca-app-pub-3940256099942544/2934735716",
      android: "ca-app-pub-3940256099942544/6300978111",
    })
  : Platform.select({
      ios: "ca-app-pub-3845309455501477/1226272054",
      android: "ca-app-pub-3845309455501477/5475135105",
    });

const Footer = () => {
  return (
    <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={adUnitID || ""} />
  );
};

export default Footer;
