import {chromium} from "playwright";
import fs from "node:fs";
import { StringUtils } from 'turbocommons-ts';


const ROOT_DIRECTORY_NAME = "public";
const SCREENSHOT_DIRECTORY_NAME = "dynamic-assets";
const IMAGE_EXTENSION = `.png`;
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;

async function createScreenshot(url: string, savePath: string): Promise<string> {
    const browser = await chromium.launch();

    const page = await browser.newPage();
    await page.setViewportSize({width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT});
    try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.screenshot({path: savePath});
    } catch (e) {
        console.error(`Error creating screenshot for URL: ${url}\n`, e);
    }
    await browser.close();
    return savePath;
}

export async function getScreenshot(url: string): Promise<string | null> {
    if (!StringUtils.isUrl(url)) {
        console.warn(`URL ${url} is not a valid URL`);
        return null
    }
    const publicUrl = `/${SCREENSHOT_DIRECTORY_NAME}/${getDomainName(url)}-${VIEWPORT_WIDTH}x${VIEWPORT_WIDTH}${IMAGE_EXTENSION}`;
    const localFilename = `${ROOT_DIRECTORY_NAME}/${publicUrl}`;

    if (await isFileExisting(localFilename)) {
        return publicUrl;
    } else {
        let screenshot = await createScreenshot(url, localFilename);
        return publicUrl
    }
}

async function isFileExisting(path: string): Promise<boolean> {
    try {
        await fs.promises.access(path)
        return true
    } catch {
        return false
    }
}

function getDomainName(url: string): string {
    const PROTOCOL_SEPARATOR = "://";
    const RESOURCE_SEPARATOR = "/";

    const domainStartIndex = url.indexOf(PROTOCOL_SEPARATOR) + PROTOCOL_SEPARATOR.length
    const domainWithPath = url.substring(domainStartIndex);
    const domainEndIndex = domainWithPath.indexOf(RESOURCE_SEPARATOR)
    if (domainEndIndex < 0) {
        return domainWithPath
    } else {
        return domainWithPath.substring(0, domainEndIndex);
    }
}