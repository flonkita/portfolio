import {
  favicons,
  config as faviconsConfig,
  type FaviconFile,
  type FaviconImage,
} from "favicons";
import { PROFILE } from "../src/content/profileData.ts";
import { mkdir, writeFile, rm } from "fs/promises";
import { existsSync } from "fs";

const FAVICONS_DIR = "./public/favicons";
const ASTRO_FILE_PATH = "./src/components/Favicons.astro";

const generateFavicons = () =>
  favicons("./public/florent-nkita-avatar.webp", {
    ...faviconsConfig.defaults,
    path: "/favicons",
    appName: PROFILE.site.SEO.title,
    appDescription: PROFILE.site.SEO.description,
    appShortName: PROFILE.name,
    lang: PROFILE.language,
    start_url: ".",
    icons: {
      android: ["android-chrome-192x192.png", "android-chrome-512x512.png"],
      windows: false,
      yandex: false,
      appleStartup: false,
      appleIcon: ["apple-touch-icon.png"],
      favicons: ["favicon-16x16.png", "favicon-32x32.png", "favicon.ico"],
    },
  });

const clearFaviconsDir = async () => {
  if (existsSync(FAVICONS_DIR)) {
    await rm(FAVICONS_DIR, { recursive: true });
  }
  await mkdir(FAVICONS_DIR);
};

const saveFaviconAsset = async (file: FaviconFile | FaviconImage) => {
  await writeFile(`${FAVICONS_DIR}/${file.name}`, file.contents);
  console.log(`${file.name} a été créé avec succès.`);
};

const generateAstroFile = async (html: string[]) => {
  const comments = [
    "<!-- Ce fichier est auto-généré. Ne le modifiez pas manuellement. -->\n",
  ];
  const formattedHtml = html.map((line) => line.replace(">", "/>")).join("\n");
  await writeFile(ASTRO_FILE_PATH, [...comments, formattedHtml, "\n"]);
  console.log(`${ASTRO_FILE_PATH} a été mis à jour.`);
};

const main = async () => {
  const { images, files, html } = await generateFavicons();
  await clearFaviconsDir();
  await Promise.all([...images, ...files].map(saveFaviconAsset));
  await generateAstroFile(html);
};

main();
