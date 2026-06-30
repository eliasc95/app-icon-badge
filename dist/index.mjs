var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
import { Jimp as Jimp4 } from "jimp";

// src/create-banner-badge.ts
import { Jimp as Jimp2, loadFont, HorizontalAlign, VerticalAlign } from "jimp";
import path2 from "path";

// src/load-overlay.ts
import { Jimp } from "jimp";
import convert from "color-convert";
import deltaE from "delta-e";
var HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
function loadOverlay(_0) {
  return __async(this, arguments, function* ({ path: path4, background }) {
    const bannerOverlay = yield Jimp.read(path4);
    if (background !== void 0 && !HEX_COLOR_REGEX.test(background)) {
      console.warn(
        `Invalid background color: ${background} - must be a hex color, #000000 has been used as default value`
      );
      return bannerOverlay;
    }
    if (background !== void 0 && HEX_COLOR_REGEX.test(background)) {
      return replaceColor({
        image: bannerOverlay,
        from: "#000000",
        to: background
      });
    }
    return bannerOverlay;
  });
}
var replaceColor = ({ image, from, to }) => {
  const fromColor = convert.hex.lab(from);
  const toColor = convert.hex.rgb(to);
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if (image.bitmap.data[idx + 3] === 0) {
      return;
    }
    const currentLABColor = convert.rgb.lab([
      image.bitmap.data[idx],
      image.bitmap.data[idx + 1],
      image.bitmap.data[idx + 2]
    ]);
    if (getDelta(currentLABColor, fromColor) <= 2.3) {
      image.bitmap.data[idx] = toColor[0];
      image.bitmap.data[idx + 1] = toColor[1];
      image.bitmap.data[idx + 2] = toColor[2];
    }
  });
  return image;
};
var getDelta = (LAB1, LAB2) => {
  return deltaE[`getDeltaE00`](
    { L: LAB1[0], A: LAB1[1], B: LAB1[2] },
    { L: LAB2[0], A: LAB2[1], B: LAB2[2] }
  );
};

// src/utils.ts
import path from "path";
var FONT_SANS_128_BLACK = path.resolve(
  __dirname,
  "./assets/fonts/open-sans-128-black.fnt"
);
var FONT_SANS_128_WHITE = path.resolve(
  __dirname,
  "./assets/fonts/open-sans-128-white.fnt"
);
var FONT_SANS_64_BLACK = path.resolve(
  __dirname,
  "./assets/fonts/open-sans-64-black.fnt"
);
var FONT_SANS_64_WHITE = path.resolve(
  __dirname,
  "./assets/fonts/open-sans-64-white.fnt"
);
var getFont = (isAdaptiveIcon, isFontBlack) => isAdaptiveIcon ? isFontBlack ? FONT_SANS_64_BLACK : FONT_SANS_64_WHITE : isFontBlack ? FONT_SANS_128_BLACK : FONT_SANS_128_WHITE;

// src/create-banner-badge.ts
function createBannerBadge(_0) {
  return __async(this, arguments, function* ({ text, position = "bottom", color = "white", background }, isAdaptiveIcon = false) {
    const IS_POSITION_TOP = position === "top";
    const BANNER_HEIGHT = isAdaptiveIcon ? 310 : 180;
    const OVERLAY_PATH = isAdaptiveIcon ? "assets/banner-overlay-adaptive.png" : "assets/banner-overlay.png";
    const font = yield loadFont(getFont(isAdaptiveIcon, color === "black"));
    const bannerOverlay = yield loadOverlay({
      path: path2.resolve(__dirname, OVERLAY_PATH),
      background
    });
    const BANNER_OVERLAY_WIDTH = bannerOverlay.bitmap.width;
    const BANNER_OVERLAY_HEIGHT = bannerOverlay.bitmap.height;
    const textContainer = new Jimp2({
      width: BANNER_OVERLAY_WIDTH,
      height: BANNER_HEIGHT,
      color: 0
    });
    textContainer.print({
      font,
      x: 0,
      y: 0,
      text: {
        text: text.toUpperCase(),
        alignmentX: HorizontalAlign.CENTER,
        alignmentY: isAdaptiveIcon ? IS_POSITION_TOP ? VerticalAlign.BOTTOM : VerticalAlign.TOP : VerticalAlign.MIDDLE
      },
      maxWidth: BANNER_OVERLAY_WIDTH,
      maxHeight: BANNER_HEIGHT
    });
    const textContainerY = IS_POSITION_TOP ? 0 : BANNER_OVERLAY_HEIGHT - BANNER_HEIGHT;
    const bannerBadge = bannerOverlay.flip({ horizontal: false, vertical: IS_POSITION_TOP }).composite(textContainer, 0, textContainerY);
    return bannerBadge;
  });
}

// src/create-ribbon-badge.ts
import { Jimp as Jimp3, loadFont as loadFont2, HorizontalAlign as HorizontalAlign2, VerticalAlign as VerticalAlign2 } from "jimp";
import path3 from "path";
var RIBBON_ROTATION_RIGHT = -45;
var RIBBON_ROTATION_LEFT = 45;
function createRibbonBadge(_0) {
  return __async(this, arguments, function* ({ position = "right", text, color = "white", background }, isAdaptiveIcon = false) {
    const IS_FONT_BLACK = color === "black";
    const IS_POSITION_LEFT = position === "left";
    const RIBBON_HEIGHT = isAdaptiveIcon ? 100 : 180;
    const TRANSLATE_BY = isAdaptiveIcon ? 80 : 270;
    const OVERLAY_PATH = isAdaptiveIcon ? "assets/ribbon-overlay-adaptive.png" : "assets/ribbon-overlay.png";
    const font = yield loadFont2(getFont(isAdaptiveIcon, IS_FONT_BLACK));
    const ribbonOverlay = yield loadOverlay({
      path: path3.resolve(__dirname, OVERLAY_PATH),
      background
    });
    const RIBBON_OVERLAY_WIDTH = ribbonOverlay.bitmap.width;
    const textContainer = new Jimp3({
      width: RIBBON_OVERLAY_WIDTH,
      height: RIBBON_HEIGHT,
      color: 0
    });
    textContainer.print(
      {
        font,
        text: {
          text,
          alignmentX: HorizontalAlign2.CENTER,
          alignmentY: VerticalAlign2.MIDDLE
        },
        x: 0,
        y: 0,
        maxWidth: RIBBON_OVERLAY_WIDTH,
        maxHeight: RIBBON_HEIGHT
      }
    );
    textContainer.rotate(
      IS_POSITION_LEFT ? RIBBON_ROTATION_LEFT : RIBBON_ROTATION_RIGHT
    );
    const TRANSLATE_X = IS_POSITION_LEFT ? -TRANSLATE_BY : TRANSLATE_BY;
    const FLIP_HORIZONTAL = IS_POSITION_LEFT;
    const TEXT_CONTAINER_X = IS_POSITION_LEFT ? TRANSLATE_X : RIBBON_OVERLAY_WIDTH - textContainer.bitmap.width + TRANSLATE_X;
    const TEXT_CONTAINER_Y = IS_POSITION_LEFT ? TRANSLATE_X : -TRANSLATE_X;
    const ribbonBadge = ribbonOverlay.flip({ horizontal: FLIP_HORIZONTAL, vertical: false }).composite(textContainer, TEXT_CONTAINER_X, TEXT_CONTAINER_Y);
    return ribbonBadge;
  });
}

// src/get-result-path.ts
function getResultPath({ icon }) {
  const iconPathArray = icon.split(".");
  iconPathArray.splice(iconPathArray.length - 1, 0, "result");
  const resultFilename = iconPathArray.join(".");
  return resultFilename;
}

// src/index.ts
function addBadge(_0) {
  return __async(this, arguments, function* ({
    icon,
    dstPath,
    isAdaptiveIcon = false,
    badges = []
  }) {
    const resultImage = yield Jimp4.read(icon);
    for (const badge of badges) {
      const badgeImage = badge.type === "ribbon" ? yield createRibbonBadge(badge, isAdaptiveIcon) : yield createBannerBadge(badge, isAdaptiveIcon);
      if (badgeImage) {
        resultImage.composite(badgeImage, 0, 0);
      }
    }
    const resultFilename = dstPath ? dstPath : getResultPath({
      icon
    });
    resultImage.write(resultFilename);
    return resultFilename;
  });
}
export {
  addBadge
};
