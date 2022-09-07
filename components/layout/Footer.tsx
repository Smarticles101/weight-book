import React from "react";
import { Platform } from "react-native";
import { useTrackingPermissions } from "expo-tracking-transparency";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

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

  if (__DEV__) {
    return null;
  }

  return (
    <BannerAd
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      unitId={adUnitID || ""}
      requestOptions={{
        requestNonPersonalizedAdsOnly: !status?.granted,
        networkExtras: { suppress_test_label: "1" },
      }}
      onAdFailedToLoad={(error) => console.warn(error)}
    />
  );
};

export default Footer;
