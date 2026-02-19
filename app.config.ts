import type { ExpoConfig } from "expo/config";

const SLUG = "kantina";
const NAME = "Kantina";

const BUNDLE_ID = "com.kantina.app";
const PACKAGE = "com.kantina.app";

// Cloud Run (produção)
const PROD_API_URL = "https://kantina-api-380728917745.southamerica-east1.run.app";

// Usa env se existir (dev/local/CI), senão produção
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? PROD_API_URL;

// etiqueta de ambiente (debug)
const appEnv = process.env.APP_ENV ?? (apiUrl === PROD_API_URL ? "production" : "custom");

// Versionamento
const version = "1.0.0";      // visível nas lojas
const iosBuildNumber = "1";  // sobe a cada envio iOS
const androidVersionCode = 1; // sobe a cada envio Android

export default (): ExpoConfig => ({
  name: NAME,
  slug: SLUG,

  version,

  orientation: "portrait",
  userInterfaceStyle: "light",
  newArchEnabled: true,

  icon: "./assets/icon.png",

  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#4E8D63",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    buildNumber: iosBuildNumber,
  },

  android: {
    package: PACKAGE,
    versionCode: androidVersionCode,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },

  extra: {
    apiUrl,
    appEnv,
  },

  plugins: ["expo-secure-store"],

  web: {
    favicon: "./assets/favicon.png",
  },
});
