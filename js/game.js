const GAME_CARD_EFFECTS = {
    "0": {
        id: "0",
        name: "植物",
        desc: "无能力。",
        afterEat: { type: "none" }
    },
    "1": {
        id: "1",
        name: "蚂蚁",
        desc: "将1只动物移动1/2/3格。",
        afterEat: { type: "move", count: 1, distanceOptions: [1, 2, 3] }
    },
    "2": {
        id: "2",
        name: "蜘蛛",
        desc: "将2只动物各移动1格。",
        afterEat: { type: "move", count: 2, distanceOptions: [1] }
    },
    "3": {
        id: "3",
        name: "小老鼠",
        desc: "将1只动物移动1/2格。",
        afterEat: { type: "move", count: 1, distanceOptions: [1, 2] }
    },
    "4": {
        id: "4",
        name: "蜥蜴",
        desc: "移除1只未进食的动物（堆叠张数为1）。",
        afterEat: { type: "remove_single", count: 1 }
    },
    "5": {
        id: "5",
        name: "大老鼠",
        desc: "将1只动物移动2格。",
        afterEat: { type: "move", count: 1, distanceOptions: [2] }
    },
    "6": {
        id: "6",
        name: "蝙蝠",
        desc: "将这只动物移动到任意一个空格。",
        afterEat: { type: "move_self_anywhere", count: 1 }
    },
    "7": {
        id: "7",
        name: "蛇",
        desc: "交换2只动物的位置。",
        afterEat: { type: "swap", count: 1 }
    },
    "8": {
        id: "8",
        name: "浣熊",
        desc: "在下一回合，如果捕食者吃了正好小1的动物，可立即丢弃1只未进食动物（堆叠=1）。",
        afterEat: { type: "next_turn_raccoon" }
    },
    "9": {
        id: "9",
        name: "狐狸",
        desc: "在下一回合，捕食者改为吃斜向相邻1格动物。",
        afterEat: { type: "next_turn_fox_diagonal" }
    },
    "10": {
        id: "10",
        name: "猞猁",
        desc: "在下一回合，捕食者必须沿正交方向跳过恰好1个动物完成进食。",
        afterEat: { type: "next_turn_lynx_jump" }
    },
    "11": {
        id: "11",
        name: "狼",
        desc: "将这只动物移动1格。",
        afterEat: { type: "move_self", count: 1, distanceOptions: [1] }
    },
    "12": {
        id: "12",
        name: "老虎",
        desc: "在下一回合，捕食者必须先移动2格才能进食。",
        afterEat: { type: "next_turn_tiger_two_step" }
    },
    "13": {
        id: "13",
        name: "鳄鱼",
        desc: "在下一回合，捕食者捕食后回到原位。",
        afterEat: { type: "next_turn_crocodile_return" }
    },
    "14": {
        id: "14",
        name: "狮子",
        desc: "在下一回合，捕食者只能吃恰好比它小1的动物。",
        afterEat: { type: "next_turn_lion_exact_one" }
    },
    "15": {
        id: "15",
        name: "北极熊",
        desc: "在下一回合，数值15不能作为捕食者。",
        afterEat: { type: "next_turn_no_polar_predator" }
    },
    whale: {
        id: "whale",
        name: "鲸鱼",
        desc: "立即将1只动物移动到任意空格。",
        afterEat: { type: "marine_whale" }
    },
    shark: {
        id: "shark",
        name: "鲨鱼",
        desc: "本回合改为先移动1格再捕食，并忽略数值差限制。",
        afterEat: { type: "marine_shark" }
    }
};

class GameLogic {
    /**
     * 获取卡牌效果定义。
     * @param {string} id 卡牌ID。
     * @returns {Object} 效果定义对象。
     */
    static getEffect(id) {
        if (GAME_CARD_EFFECTS[id]) {
            return GAME_CARD_EFFECTS[id];
        }
        return GAME_CARD_EFFECTS["0"];
    }

    /**
     * 获取卡牌效果描述文本。
     * @param {string} id 卡牌ID。
     * @returns {string} 描述文本。
     */
    static getEffectDesc(id) {
        return this.getEffect(id).desc;
    }

    /**
     * 将“捕食后效果”转成执行队列与下一回合修饰器。
     * @param {string} predatorTopId 捕食者顶牌ID。
     * @param {number} predatorIndex 捕食前捕食者位置。
     * @param {number} resultIndex 捕食完成后堆叠所在位置。
     * @param {number} eatDiff predatorValue - preyValue。
     * @param {Object|null} activeTurnEffects 本回合生效中的“上一回合效果”。
     * @returns {Object} 结果对象。
     */
    static resolveAfterEat(predatorTopId, predatorIndex, resultIndex, eatDiff, activeTurnEffects) {
        const effect = this.getEffect(predatorTopId).afterEat;
        const result = {
            actions: [],
            pendingTurnEffects: null
        };

        if (!effect || effect.type === "none") {
            result.pendingTurnEffects = this.mergePendingEffects(null, null);
        } else if (effect.type === "move") {
            result.actions.push({
                type: "move",
                remaining: effect.count,
                distanceOptions: effect.distanceOptions,
                sourceFixed: -1
            });
        } else if (effect.type === "move_self_anywhere") {
            result.actions.push({
                type: "move",
                remaining: 1,
                distanceOptions: [],
                sourceFixed: resultIndex
            });
        } else if (effect.type === "move_self") {
            result.actions.push({
                type: "move",
                remaining: 1,
                distanceOptions: effect.distanceOptions,
                sourceFixed: resultIndex
            });
        } else if (effect.type === "swap") {
            result.actions.push({
                type: "swap",
                remaining: 1
            });
        } else if (effect.type === "remove_single") {
            result.actions.push({
                type: "remove_single",
                remaining: 1,
                forbiddenIndex: resultIndex
            });
        }

        result.pendingTurnEffects = this.toNextTurnEffects(effect);

        if (activeTurnEffects && activeTurnEffects.raccoonOn && eatDiff === 1) {
            result.actions.push({
                type: "remove_single",
                remaining: 1,
                forbiddenIndex: resultIndex
            });
        }
        return result;
    }

    /**
     * 把“捕食后效果”转换成“下一回合效果”对象。
     * @param {Object} effect 捕食后效果。
     * @returns {Object|null} 下一回合效果。
     */
    static toNextTurnEffects(effect) {
        if (!effect) {
            return null;
        }
        const result = {
            foxDiagonal: false,
            lynxJump: false,
            tigerTwoStep: false,
            crocodileReturn: false,
            lionExactOne: false,
            noPolarPredator: false,
            raccoonOn: false
        };

        if (effect.type === "next_turn_fox_diagonal") {
            result.foxDiagonal = true;
            return result;
        }
        if (effect.type === "next_turn_lynx_jump") {
            result.lynxJump = true;
            return result;
        }
        if (effect.type === "next_turn_tiger_two_step") {
            result.tigerTwoStep = true;
            return result;
        }
        if (effect.type === "next_turn_crocodile_return") {
            result.crocodileReturn = true;
            return result;
        }
        if (effect.type === "next_turn_lion_exact_one") {
            result.lionExactOne = true;
            return result;
        }
        if (effect.type === "next_turn_no_polar_predator") {
            result.noPolarPredator = true;
            return result;
        }
        if (effect.type === "next_turn_raccoon") {
            result.raccoonOn = true;
            return result;
        }
        return null;
    }

    /**
     * 合并两个下一回合效果对象。
     * @param {Object|null} a 效果A。
     * @param {Object|null} b 效果B。
     * @returns {Object|null} 合并结果。
     */
    static mergePendingEffects(a, b) {
        if (!a && !b) {
            return null;
        }
        const left = a || {};
        const right = b || {};
        return {
            foxDiagonal: !!(left.foxDiagonal || right.foxDiagonal),
            lynxJump: !!(left.lynxJump || right.lynxJump),
            tigerTwoStep: !!(left.tigerTwoStep || right.tigerTwoStep),
            crocodileReturn: !!(left.crocodileReturn || right.crocodileReturn),
            lionExactOne: !!(left.lionExactOne || right.lionExactOne),
            noPolarPredator: !!(left.noPolarPredator || right.noPolarPredator),
            raccoonOn: !!(left.raccoonOn || right.raccoonOn)
        };
    }

    /**
     * 下一回合效果文本。
     * @param {Object|null} effects 效果对象。
     * @returns {string} 文本。
     */
    static effectSummary(effects) {
        if (!effects) {
            return "无";
        }
        const items = [];
        if (effects.foxDiagonal) {
            items.push("狐狸：本回合捕食改为斜向相邻");
        }
        if (effects.lynxJump) {
            items.push("猞猁：本回合捕食需正交跳过1个动物");
        }
        if (effects.tigerTwoStep) {
            items.push("老虎：本回合捕食目标需正交2格");
        }
        if (effects.crocodileReturn) {
            items.push("鳄鱼：本回合捕食后回原位");
        }
        if (effects.lionExactOne) {
            items.push("狮子：本回合只能吃小1");
        }
        if (effects.noPolarPredator) {
            items.push("北极熊：本回合15不能做捕食者");
        }
        if (effects.raccoonOn) {
            items.push("浣熊：若吃小1可立即移除1只单层动物");
        }
        if (items.length === 0) {
            return "无";
        }
        return items.join("；");
    }
}

APP.GameLogic = GameLogic;
