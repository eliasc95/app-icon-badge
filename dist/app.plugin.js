"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/types/icon-config.ts
var isThemeIconConfig = (iconConfig) => {
  return typeof iconConfig === "object" && iconConfig !== null && ("light" in iconConfig || "dark" in iconConfig || "tinted" in iconConfig);
};

// src/utils/icon-validation.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var validateIconPath = (iconPath) => {
  if (!fs.existsSync(iconPath)) {
    console.warn(`Icon file not found: ${iconPath}`);
    return false;
  }
  const validExtensions = [".png", ".jpg", ".jpeg"];
  const ext = path.extname(iconPath).toLowerCase();
  if (!validExtensions.includes(ext)) {
    console.warn(`Unsupported icon format: ${ext}. Supported formats: ${validExtensions.join(", ")}`);
    return false;
  }
  return true;
};
var getIconPath = (iconConfig) => {
  if (typeof iconConfig === "string") {
    return validateIconPath(iconConfig) ? iconConfig : null;
  }
  if (isThemeIconConfig(iconConfig)) {
    const path4 = iconConfig.light || iconConfig.dark || iconConfig.tinted;
    return path4 && validateIconPath(path4) ? path4 : null;
  }
  return null;
};
var getValidIconVariants = (iconConfig) => {
  return {
    light: iconConfig.light && validateIconPath(iconConfig.light) ? iconConfig.light : null,
    dark: iconConfig.dark && validateIconPath(iconConfig.dark) ? iconConfig.dark : null,
    tinted: iconConfig.tinted && validateIconPath(iconConfig.tinted) ? iconConfig.tinted : null
  };
};

// src/utils/file-operations.ts
var fs3 = __toESM(require("fs"));
var path3 = __toESM(require("path"));

// src/get-result-path.ts
function getResultPath({ icon }) {
  const iconPathArray = icon.split(".");
  iconPathArray.splice(iconPathArray.length - 1, 0, "result");
  const resultFilename = iconPathArray.join(".");
  return resultFilename;
}

// src/add-badge-sync.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_child_process = require("child_process");
function addBadgeSync({
  icon,
  dstPath,
  isAdaptiveIcon = false,
  badges = []
}) {
  const resultFilename = dstPath ? dstPath : getResultPath({
    icon
  });
  const dir = import_path.default.dirname(resultFilename);
  if (!import_fs.default.existsSync(dir)) {
    import_fs.default.mkdirSync(dir, { recursive: true });
  }
  try {
    import_fs.default.copyFileSync(icon, resultFilename);
  } catch (error) {
    console.warn("Failed to copy icon:", error);
    return resultFilename;
  }
  try {
    let currentInputFile = import_path.default.resolve(icon);
    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i];
      let cmd = `node "${import_path.default.resolve(__dirname, "../dist/cli.js")}" "${currentInputFile}" -t ${badge == null ? void 0 : badge.type} -x "${badge == null ? void 0 : badge.text}" -c ${(badge == null ? void 0 : badge.color) || "white"}`;
      if (badge == null ? void 0 : badge.background) {
        cmd += ` -b "${badge.background}"`;
      }
      if (badge == null ? void 0 : badge.position) {
        cmd += ` -p ${badge.position}`;
      }
      (0, import_child_process.execSync)(cmd, {
        stdio: "pipe",
        timeout: 1e4,
        cwd: import_path.default.dirname(currentInputFile)
      });
      const resultPath = getResultPath({ icon: currentInputFile });
      if (import_fs.default.existsSync(resultPath)) {
        if (i === badges.length - 1) {
          import_fs.default.copyFileSync(resultPath, resultFilename);
          import_fs.default.unlinkSync(resultPath);
        } else {
          const tempFile = import_path.default.resolve(import_path.default.dirname(resultFilename), `temp-badge-${i}.png`);
          import_fs.default.copyFileSync(resultPath, tempFile);
          import_fs.default.unlinkSync(resultPath);
          currentInputFile = tempFile;
        }
      }
    }
    for (let i = 0; i < badges.length - 1; i++) {
      const tempFile = import_path.default.resolve(import_path.default.dirname(resultFilename), `temp-badge-${i}.png`);
      if (import_fs.default.existsSync(tempFile)) {
        import_fs.default.unlinkSync(tempFile);
      }
    }
  } catch (error) {
    console.warn("Badge generation failed, using original icon:", error);
    for (let i = 0; i < badges.length; i++) {
      const tempFile = import_path.default.resolve(import_path.default.dirname(resultFilename), `temp-badge-${i}.png`);
      if (import_fs.default.existsSync(tempFile)) {
        import_fs.default.unlinkSync(tempFile);
      }
    }
  }
  return resultFilename;
}

// src/utils/file-operations.ts
var ensureDirectoryExists = (dirPath) => {
  if (!fs3.existsSync(dirPath)) {
    fs3.mkdirSync(dirPath, { recursive: true });
  }
};
var generateBadgedIcon = (iconPath, destPath, badges, isAdaptiveIcon = false) => {
  try {
    ensureDirectoryExists(path3.dirname(destPath));
    addBadgeSync({
      icon: iconPath,
      dstPath: destPath,
      badges,
      isAdaptiveIcon
    });
  } catch (error) {
    console.error(`Failed to generate badged icon for ${iconPath}:`, error);
    throw error;
  }
};

// src/utils/config-utils.ts
var updateIOSIconConfig = (config, iconConfig) => {
  if (!config.ios) {
    config.ios = {};
  }
  config.ios.icon = iconConfig;
};

// src/plugin/with-icon-badge.ts
var DST_APP_ICON_BADGE_FOLDER = ".expo/app-icon-badge";
var DST_ICON = `${DST_APP_ICON_BADGE_FOLDER}/icon.png`;
var DST_ANDROID_ICON = `${DST_APP_ICON_BADGE_FOLDER}/android-icon.png`;
var DST_ADAPTIVE_APP_ICON = `${DST_APP_ICON_BADGE_FOLDER}/foregroundImage.png`;
var DST_IOS_ICON_LIGHT = `${DST_APP_ICON_BADGE_FOLDER}/ios-icon-light.png`;
var DST_IOS_ICON_DARK = `${DST_APP_ICON_BADGE_FOLDER}/ios-icon-dark.png`;
var DST_IOS_ICON_TINTED = `${DST_APP_ICON_BADGE_FOLDER}/ios-icon-tinted.png`;
var withIcon = (config, options) => {
  const iconPath = getIconPath(config == null ? void 0 : config.icon);
  if (iconPath) {
    config.icon = DST_ICON;
  }
  return config;
};
var withIconBadgeAndroid = (config, options) => {
  var _a, _b, _c, _d;
  const androidIconPath = getIconPath((_a = config == null ? void 0 : config.android) == null ? void 0 : _a.icon);
  if (androidIconPath && config.android) {
    config.android.icon = DST_ANDROID_ICON;
  }
  const adaptiveIconPath = getIconPath((_c = (_b = config == null ? void 0 : config.android) == null ? void 0 : _b.adaptiveIcon) == null ? void 0 : _c.foregroundImage);
  if (adaptiveIconPath && ((_d = config.android) == null ? void 0 : _d.adaptiveIcon)) {
    config.android.adaptiveIcon.foregroundImage = DST_ADAPTIVE_APP_ICON;
  }
  return config;
};
var withIconBadgeIOS = (config, options) => {
  var _a;
  const iosIconConfig = (_a = config == null ? void 0 : config.ios) == null ? void 0 : _a.icon;
  if (!iosIconConfig) {
    return config;
  }
  if (isThemeIconConfig(iosIconConfig)) {
    const newIconConfig = {};
    if (iosIconConfig.light) {
      newIconConfig.light = DST_IOS_ICON_LIGHT;
    }
    if (iosIconConfig.dark) {
      newIconConfig.dark = DST_IOS_ICON_DARK;
    }
    if (iosIconConfig.tinted) {
      newIconConfig.tinted = DST_IOS_ICON_TINTED;
    }
    updateIOSIconConfig(config, newIconConfig);
  } else {
    updateIOSIconConfig(config, DST_ICON);
  }
  return config;
};
var withIconBadge = (config, options) => {
  var _a, _b, _c, _d, _e;
  const { badges = [], enabled = true } = options;
  if (!enabled) return config;
  const originalIconPath = getIconPath(config == null ? void 0 : config.icon);
  const originalAndroidIconPath = getIconPath((_a = config == null ? void 0 : config.android) == null ? void 0 : _a.icon);
  const originalAdaptiveIconPath = getIconPath((_c = (_b = config == null ? void 0 : config.android) == null ? void 0 : _b.adaptiveIcon) == null ? void 0 : _c.foregroundImage);
  const originalIOSIconPath = getIconPath((_d = config == null ? void 0 : config.ios) == null ? void 0 : _d.icon);
  const originalIOSIconConfig = (_e = config == null ? void 0 : config.ios) == null ? void 0 : _e.icon;
  try {
    if (!options.badges || options.badges.length === 0) {
      console.warn("No badges configured, skipping badge generation");
      return config;
    }
    if (originalIconPath) {
      generateBadgedIcon(originalIconPath, DST_ICON, options.badges);
    }
    if (originalIOSIconConfig) {
      if (isThemeIconConfig(originalIOSIconConfig)) {
        const variants = getValidIconVariants(originalIOSIconConfig);
        if (variants.light) {
          generateBadgedIcon(variants.light, DST_IOS_ICON_LIGHT, options.badges);
        }
        if (variants.dark) {
          generateBadgedIcon(variants.dark, DST_IOS_ICON_DARK, options.badges);
        }
        if (variants.tinted) {
          generateBadgedIcon(variants.tinted, DST_IOS_ICON_TINTED, options.badges);
        }
      } else if (typeof originalIOSIconConfig === "string" && !originalIconPath) {
        generateBadgedIcon(originalIOSIconConfig, DST_ICON, options.badges);
      }
    }
    if (originalAndroidIconPath) {
      generateBadgedIcon(originalAndroidIconPath, DST_ANDROID_ICON, options.badges);
    }
    if (originalAdaptiveIconPath) {
      generateBadgedIcon(originalAdaptiveIconPath, DST_ADAPTIVE_APP_ICON, options.badges, true);
    }
  } catch (error) {
    console.error("Badge generation failed:", error);
    console.warn("Falling back to original icons without badges");
    return config;
  }
  config = withIcon(config, options);
  config = withIconBadgeAndroid(config, { badges });
  config = withIconBadgeIOS(config, { badges });
  return config;
};

// src/plugin/app.plugin.ts
module.exports = withIconBadge;
