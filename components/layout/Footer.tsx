import { BannerAd, BannerAdSize } from "@react-native-admob/admob";
import React from "react";
import { Platform } from "react-native";
import { useTrackingPermissions } from "expo-tracking-transparency";

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
  const [status] = useTrackingPermissions();

  return (
    <BannerAd
      size={BannerAdSize.ADAPTIVE_BANNER}
      unitId={adUnitID || ""}
      requestOptions={{ requestNonPersonalizedAdsOnly: !status?.granted }}
    />
  );
};

export default Footer;
