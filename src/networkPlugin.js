//src/networkPlugin.js
import { AdNetworkFactory, Mintegral } from "./lib/ad-network-plugin.js";
import { config } from "./config.js";

// Do not touch here unless you know what you're doing
export const networkPlugin = AdNetworkFactory.createAdNetwork(config.adNetworkType);
export const mraidAdNetworks = new Set(["unityads", "adcolony", "applovin", "kayzen"]);

export function adStart() {
    if (config.adNetworkType === "mintegral") {
        Mintegral.gameStart();
    }
}

export function adEnd() {
    if (config.adNetworkType === "mintegral") {
        Mintegral.gameEnd();
    }
}

export function adClose() {
    if (config.adNetworkType === "mintegral") {
        Mintegral.gameClose(() => {
            console.log("Game close worked!");
        });
    }
}

export function adRetry() {
    if (config.adNetworkType === "mintegral") {
        Mintegral.gameRetry();
    }
}

export function adReady() {
    if (config.adNetworkType === "mintegral") {
        Mintegral.gameReady();
    }
}