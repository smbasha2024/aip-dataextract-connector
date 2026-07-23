export type HttpProtocol = "http" | "https";

export interface AppConfig {
    name: string;
    version: string;
}

export interface DockerConfig {
    containerName: string;
    imageName: string;
    network: string;
}

export interface BackendConfig {
    protocol: HttpProtocol;
    host: string;
    port: number;
    healthEndpoint: string;
    websocketEndpoint: string;
    readonly baseUrl: string;
    readonly healthUrl: string;
    readonly websocketUrl: string;
}

export interface ConnectorConfig {
    app: AppConfig;
    docker: DockerConfig;
    backend: BackendConfig;
}

export const APP_CONFIG: AppConfig = {
    name: "AIProxys Connector",
    version: "0.1.0",
};

export const DOCKER_CONFIG: DockerConfig = {
    containerName: "aip-dataextract-connector",
    imageName: "ghcr.io/ricago/aip-dataextract-connector",
    network: "bridge",
};

export const BACKEND_CONFIG: BackendConfig = {
    protocol: "http",
    host: "127.0.0.1",
    port: 8001,
    healthEndpoint: "/health",
    websocketEndpoint: "/ws",
    get baseUrl(): string {
        return `${this.protocol}://${this.host}:${this.port}`;
    },

    get healthUrl(): string {
        return `${this.baseUrl}${this.healthEndpoint}`;
    },

    get websocketUrl(): string {
        const websocketProtocol: "ws" | "wss" =
            this.protocol === "https"
                ? "wss"
                : "ws";

        return `${websocketProtocol}://${this.host}:${this.port}${this.websocketEndpoint}`;
    },
};

export const CONNECTOR = Object.freeze({
    app: APP_CONFIG,
    docker: DOCKER_CONFIG,
    backend: BACKEND_CONFIG,
} satisfies ConnectorConfig);