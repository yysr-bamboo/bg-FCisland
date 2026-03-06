const CONFIG = {
    COOKIE_KEY: "food_chain_island_data",
    BOARD_COLS: 4,
    BOARD_ROWS: 4,
    LAND_CARD_COUNT: 16,
    IMAGE_A: "./assets/images/cards_A.png",
    IMAGE_B: "./assets/images/cards_B.png"
    // IMAGE_A: "https://i.imgs.ovh/2026/03/06/Oa8b51.png",
    // IMAGE_B: "./assets/images/cards_B.png"
};

const APP = {};

const STORE = {
    selectedMarineIds: [],
    carriedMarineIds: [],
    board: [],
    selectedCell: -1,
    turnCount: 0,
    score: 0,
    isGameEnded: false,
    lastResult: null,
    highlightedTargets: [],
    mode: "normal",
    pendingActionQueue: [],
    currentAction: null,
    actionSourceIndex: -1,
    turnPrepared: false,
    activeTurnEffects: null,
    pendingTurnEffects: null
};

class CookieTool {
    /**
     * 写入 JSON 数据到 cookie。
     * @param {string} key cookie 键。
     * @param {Object} value 要写入的对象。
     * @param {number} days 有效天数。
     * @returns {void}
     */
    static setJSON(key, value, days) {
        let expiresText = "";
        let date = null;
        if (typeof days === "number" && days > 0) {
            date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expiresText = "; expires=" + date.toUTCString();
        }
        document.cookie = key + "=" + encodeURIComponent(JSON.stringify(value)) + expiresText + "; path=/";
    }

    /**
     * 从 cookie 读取 JSON 数据。
     * @param {string} key cookie 键。
     * @returns {Object|null} 读取结果，失败返回 null。
     */
    static getJSON(key) {
        const all = document.cookie ? document.cookie.split("; ") : [];
        let i = 0;
        let parts = null;
        for (i = 0; i < all.length; i += 1) {
            parts = all[i].split("=");
            if (parts[0] === key) {
                try {
                    return JSON.parse(decodeURIComponent(parts.slice(1).join("=")));
                } catch (error) {
                    return null;
                }
            }
        }
        return null;
    }
}

APP.CookieTool = CookieTool;
