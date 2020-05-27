import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const isDev = process.env.NODE_ENV === "development";
const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

interface PuppeteerOptions {
  args: string[];
  executablePath: string;
  headless: boolean;
}

export const getOptions = async (isDev: boolean): Promise<PuppeteerOptions> => {
  if (isDev) {
    return {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  }
  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };
};

type ScreenshotOptions = {
  url: string;
};

export const getScreenshot = async ({
  url,
}: ScreenshotOptions): Promise<Buffer> => {
  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // Set viewport to something big
  await page.setViewport({
    width: 2560,
    height: 1080,
    deviceScaleFactor: 2,
  });

  await page.goto(url, { waitUntil: "load" });

  const exportContainer = await page.waitForSelector("#export-container");
  const elementBounds = await exportContainer.boundingBox();

  if (!elementBounds)
    throw new Error("Cannot get export container bounding box");

  const buffer = await exportContainer.screenshot({
    encoding: "binary",
    clip: {
      ...elementBounds,
      // This avoids a black line towards the left and bottom side of images,
      // which only occured when certain fonts were used, see https://goo.gl/JHHskx
      x: Math.round(elementBounds.x),
      height: Math.round(elementBounds.height) - 1,
    },
  });

  return buffer;
};
