import { app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { __dirname };

/**
 * Root of the desktop project.
 *
 * Development:
 *   <project>/desktop
 *
 * Packaged:
 *   <App>.app/Contents/Resources
 */
export function getRootPath(): string {
    return app.isPackaged
        ? process.resourcesPath
        : path.join(__dirname, "../..");
}

/**
 * Assets directory.
 */
export function getAssetsPath(): string {
    return app.isPackaged
        ? path.join(process.resourcesPath, "assets")
        : path.join(__dirname, "../../assets");
}

/**
 * Returns the absolute path of an asset.
 */
export function getAssetPath(file: string): string {
    return path.join(getAssetsPath(), file);
}

/**
 * Frontend build directory.
 */
export function getFrontendPath(): string {
    return app.isPackaged
        ? path.join(process.resourcesPath, "frontend")
        : path.join(__dirname, "../../../frontend/dist");
}

/**
 * Returns the absolute path of a frontend file.
 */
export function getFrontendFile(file: string): string {
    return path.join(getFrontendPath(), file);
}

/**
 * Resources directory (if you keep additional resources here).
 */
export function getResourcesPath(): string {
    return app.isPackaged
        ? process.resourcesPath
        : path.join(__dirname, "../../resources");
}

/**
 * Returns the absolute path of a resource.
 */
export function getResourcePath(file: string): string {
    return path.join(getResourcesPath(), file);
}

/**
 * Temporary directory.
 */
export function getTempPath(): string {
    return app.getPath("temp");
}

/**
 * User data directory.
 * Suitable for application settings, SQLite databases, logs, etc.
 */
export function getUserDataPath(): string {
    return app.getPath("userData");
}

/**
 * Returns a file inside the user data directory.
 */
export function getUserDataFile(file: string): string {
    return path.join(getUserDataPath(), file);
}

/**
 * Logs directory.
 */
export function getLogsPath(): string {
    return app.getPath("logs");
}

/**
 * Returns a log file path.
 */
export function getLogFile(file: string): string {
    return path.join(getLogsPath(), file);
}

/**
 * Home directory.
 */
export function getHomePath(): string {
    return app.getPath("home");
}

/**
 * Downloads directory.
 */
export function getDownloadsPath(): string {
    return app.getPath("downloads");
}

/**
 * Desktop directory.
 */
export function getDesktopPath(): string {
    return app.getPath("desktop");
}

/**
 * Documents directory.
 */
export function getDocumentsPath(): string {
    return app.getPath("documents");
}

/**
 * Executable path.
 */
export function getExecutablePath(): string {
    return app.getPath("exe");
}

/**
 * Application installation path.
 */
export function getAppPath(): string {
    return app.getAppPath();
}

export function getDistPath(): string {
    return app.isPackaged ? app.getAppPath() : path.join(__dirname, "..");
}

export function getPreloadPath(): string {
    return path.join(getDistPath(), "preload.js");
}

export function getAppIconPath(): string {
    switch (process.platform) {
        case "darwin":
            return getAssetPath("icon.png");

        case "win32":
            return getAssetPath("icon.ico");

        default:
            return getAssetPath("icon.png");
    }
}

export function getTrayIconPath(): string {
    switch (process.platform) {
        case "darwin":
            // Prefer a template icon for macOS tray
            return getAssetPath("icon.png");

        case "win32":
            return getAssetPath("icon.ico");

        default:
            return getAssetPath("icon.png");
    }
}
