class Page {
    /**
     * 页面对象。
     */
    constructor() {
        this.root = document.getElementById("app");
        this.cardMap = this.buildCardMap();
        this.cachedData = APP.CookieTool.getJSON(CONFIG.COOKIE_KEY) || {};
        this.createLayout();
        this.bindEvents();
        this.updateHomeSummary();
        this.showScreen("home");
    }

    /**
     * 构建卡牌信息。
     * @returns {Object} 卡牌映射。
     */
    buildCardMap() {
        const names = ["植物", "蚂蚁", "蜘蛛", "小老鼠", "蜥蜴", "大老鼠", "蝙蝠", "蛇", "浣熊", "狐狸", "猞猁", "狼", "老虎", "鳄鱼", "狮子", "北极熊"];
        const map = {};
        let i = 0;
        for (i = 0; i <= 8; i += 1) {
            map[String(i)] = { id: String(i), name: names[i], value: i, sheet: "A", row: Math.floor(i / 3), col: i % 3, rows: 3, cols: 3 };
        }
        for (i = 9; i <= 15; i += 1) {
            map[String(i)] = { id: String(i), name: names[i], value: i, sheet: "B", row: Math.floor((i - 9) / 3), col: (i - 9) % 3, rows: 3, cols: 3 };
        }
        map.whale = { id: "whale", name: "鲸鱼", value: null, sheet: "B", row: 2, col: 1, rows: 3, cols: 3, desc: APP.GameLogic.getEffectDesc("whale") };
        map.shark = { id: "shark", name: "鲨鱼", value: null, sheet: "B", row: 2, col: 2, rows: 3, cols: 3, desc: APP.GameLogic.getEffectDesc("shark") };
        return map;
    }

    /**
     * 创建布局。
     * @returns {void}
     */
    createLayout() {
        this.shell = document.createElement("section");
        this.shell.className = "page-shell select-none";
        this.root.appendChild(this.shell);
        this.homeScreen = this.createHomeScreen();
        this.ruleScreen = this.createRuleScreen();
        this.selectScreen = this.createSelectScreen();
        this.gameScreen = this.createGameScreen();
        this.endScreen = this.createEndScreen();
        this.shell.appendChild(this.homeScreen);
        this.shell.appendChild(this.ruleScreen);
        this.shell.appendChild(this.selectScreen);
        this.shell.appendChild(this.gameScreen);
        this.shell.appendChild(this.endScreen);
    }

    /**
     * 首页。
     * @returns {HTMLElement} 首页元素。
     */
    createHomeScreen() {
        const screen = document.createElement("section");
        screen.className = "screen";
        screen.setAttribute("data-screen", "home");
        const title = document.createElement("h1");
        title.className = "title";
        title.textContent = "食物链岛";
        const subtitle = document.createElement("p");
        subtitle.className = "subtitle";
        subtitle.textContent = "单机版 · 16张陆地动物卡 + 可选海洋动物卡";
        this.homeSummary = document.createElement("p");
        this.homeSummary.className = "subtitle";
        const row = document.createElement("div");
        row.className = "btn-row";
        this.btnHomeStart = document.createElement("button");
        this.btnHomeStart.className = "btn btn-primary";
        this.btnHomeStart.textContent = "开始游戏";
        this.btnHomeRule = document.createElement("button");
        this.btnHomeRule.className = "btn btn-secondary";
        this.btnHomeRule.textContent = "游戏规则";
        row.appendChild(this.btnHomeStart);
        row.appendChild(this.btnHomeRule);
        screen.appendChild(title);
        screen.appendChild(subtitle);
        screen.appendChild(this.homeSummary);
        screen.appendChild(row);
        return screen;
    }

    /**
     * 规则页。
     * @returns {HTMLElement} 规则页元素。
     */
    createRuleScreen() {
        const screen = document.createElement("section");
        screen.className = "screen display-none";
        screen.setAttribute("data-screen", "rule");
        const title = document.createElement("h2");
        title.className = "title";
        title.textContent = "游戏规则";
        const box = document.createElement("article");
        box.className = "rules-box";
        box.innerHTML = `<p><b style="font-size:2.2em;">Food Chain Island 规则</b></p>

<p><b style="font-size:1.9em;">组件</b></p>
<p>16 张动物卡</p>
<p>2 张海洋动物卡（鲨鱼和鲸鱼）</p>

<p><b style="font-size:1.9em;">开局设置</b></p>
<p><b style="font-size:1.7em;">选择难度</b></p>
<p>展示2张海洋动物，选择携带哪些动物开始游戏（可以选择0张、1张、2张）</p>

<p><b style="font-size:1.7em;">设置地图</b></p>
<p>选择完难度后，将非海洋动物洗混，并将它们正面朝上摆放成一个 4x4 的网格，代表岛屿的地图。</p>

<p><b style="font-size:1.9em;">游戏流程</b></p>
<p>游戏分为若干回合，每回合你必须按照如下步骤进行一系列行动，直到你无法再进行下一个回合。</p>
<p>在每个回合中，一只动物会吃掉另一只动物，然后触发它的特殊能力。</p>

<p><b style="font-size:1.7em;">1，进食</b></p>
<p>选择地图上的一只动物作为捕食者，将它移动到正交相邻1格的一只动物上面，以吃掉它。</p>
<p>并且只能吃数值比它小 1、2 或 3 的猎物。</p>
<p>当捕食者吃掉猎物时，它们会形成一个堆叠，被吃的动物会放在堆叠底部。一个堆叠被视为一只单一的动物，其数值和能力由最顶层的动物决定。移动动物时，整个堆叠一起移动。</p>

<p><b style="font-size:1.7em;">2，发动能力</b></p>
<p>在捕食者吃掉它的猎物之后，必须执行捕食者的能力。</p>

<p><b style="font-size:1.5em;">移动能力说明</b></p>
<p>某些能力需要你移动动物。只有地图上的动物才能移动（海洋动物不属于地图）。</p>
<p>动物可以移动到原始地图范围之外的空位，即：地图是一个可以向所有方向延伸的网格。</p>
<p>动物移动时必须沿着正交方向移动。</p>
<p>如果一只动物移动1格，它必须移动到空格上。</p>
<p>如果一只动物移动多个空格，它可以向多个方向移动（例如，它可以先向下再向右移动 2 格）、它可以越过其他动物，但必须遵守2个条件：</p>
<p>1. 必须落在空位上。</p>
<p>2. 不能结束在起始位置，例如，它移动2格时，不能先向左再向右移动回到原处。</p>

<p><b style="font-size:1.7em;">特殊行动</b></p>
<p>在任一回合中的任何时候，你可以弃掉一张海洋动物来使用它的能力。你可以在一个回合内使用多张海洋动物。</p>
<p>如果海洋动物的能力与捕食者的特殊能力冲突，则忽略捕食者的能力。</p>

<p><b style="font-size:1.9em;">游戏结束</b></p>
<p>当你无法再进行额外的回合时，数一数地图上剩余的陆地动物数量 N，你的得分为 4 减去 N。</p>

<p><b style="font-size:1.9em;">附录 - 卡牌列表</b></p>
<p>植物（0）：无能力。</p>
<p>蚂蚁（1）：将1只动物移动1/2/3格。</p>
<p>蜘蛛（2）：将2只动物各移动1格。</p>
<p>小老鼠（3）：将1只动物移动1/2格。</p>
<p>蜥蜴（4）：移除1只未进食的动物（堆叠张数为1）。</p>
<p>大老鼠（5）：将1只动物移动2格。</p>
<p>蝙蝠（6）：将这只动物移动到任意一个空格。</p>
<p>蛇（7）：交换2只动物的位置。</p>
<p>浣熊（8）：在下一回合，如果捕食者吃了一只正好比它自己小1的动物，则可以立即丢弃一只未进食的动物（堆叠张数为1）。</p>
<p>狐狸（9）：在下一回合，捕食者必须改为吃与其斜着相邻恰好1格的动物。</p>
<p>猞猁（10）：在下一回合，捕食者必须沿正交方向跳过恰好1个动物完成进食。</p>
<p>狼（11）：将这只动物移动1格。</p>
<p>老虎（12）：在下一回合，捕食者必须先移动2格才能进食。</p>
<p>鳄鱼（13）：在下一回合，捕食者捕食后回到原位。</p>
<p>狮子（14）：在下一回合，捕食者只能吃掉恰好比它数值小1的动物。</p>
<p>北极熊（15）：在下一回合，这张牌不能作为捕食者。</p>
<p>鲸鱼（海洋动物）：立即将1只动物移动到任意空格上。</p>
<p>鲨鱼（海洋动物）：代替本回合的正常捕食阶段，改为移动1只动物1格，然后再让这只动物捕食，本次捕食，它可以吃掉比自己小任意数值的动物（不受只能吃掉小1/2/3的规则限制）。</p>`;
        const row = document.createElement("div");
        row.className = "btn-row";
        this.btnRuleBack = document.createElement("button");
        this.btnRuleBack.className = "btn btn-secondary";
        this.btnRuleBack.textContent = "返回首页";
        row.appendChild(this.btnRuleBack);
        screen.appendChild(title);
        screen.appendChild(box);
        screen.appendChild(row);
        return screen;
    }

    /**
     * 难度页。
     * @returns {HTMLElement} 难度页元素。
     */
    createSelectScreen() {
        const screen = document.createElement("section");
        screen.className = "screen display-none";
        screen.setAttribute("data-screen", "select");
        const title = document.createElement("h2");
        title.className = "title";
        title.textContent = "选择难度（海洋动物携带）";
        const subtitle = document.createElement("p");
        subtitle.className = "subtitle";
        subtitle.textContent = "可勾选0~2张海洋动物卡：全选=全部携带，全不选=不携带";
        const options = document.createElement("div");
        options.className = "marine-options";
        this.whaleOption = this.createMarineOption("whale");
        this.sharkOption = this.createMarineOption("shark");
        options.appendChild(this.whaleOption.wrap);
        options.appendChild(this.sharkOption.wrap);
        const row = document.createElement("div");
        row.className = "btn-row";
        this.btnSelectStart = document.createElement("button");
        this.btnSelectStart.className = "btn btn-primary";
        this.btnSelectStart.textContent = "开始对局";
        this.btnSelectBack = document.createElement("button");
        this.btnSelectBack.className = "btn btn-secondary";
        this.btnSelectBack.textContent = "返回首页";
        row.appendChild(this.btnSelectStart);
        row.appendChild(this.btnSelectBack);
        screen.appendChild(title);
        screen.appendChild(subtitle);
        screen.appendChild(options);
        screen.appendChild(row);
        return screen;
    }

    /**
     * 海洋动物选项。
     * @param {string} id 卡牌ID。
     * @returns {Object} 选项对象。
     */
    createMarineOption(id) {
        const cardInfo = this.cardMap[id];
        const wrap = document.createElement("label");
        wrap.className = "marine-option cursor-pointer";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.setAttribute("data-marine-id", id);
        const cardNode = this.createCardNode(cardInfo, true, false);
        const text = document.createElement("div");
        text.className = "marine-text";
        const name = document.createElement("h3");
        name.className = "marine-name text-overflow-ellipsis";
        name.textContent = cardInfo.name;
        const desc = document.createElement("p");
        desc.className = "marine-desc";
        desc.textContent = cardInfo.desc;
        text.appendChild(name);
        text.appendChild(desc);
        wrap.appendChild(input);
        wrap.appendChild(cardNode);
        wrap.appendChild(text);
        return { wrap: wrap, input: input };
    }

    /**
     * 对局页。
     * @returns {HTMLElement} 对局页元素。
     */
    createGameScreen() {
        const screen = document.createElement("section");
        screen.className = "screen display-none game-screen";
        screen.setAttribute("data-screen", "game");
        const layout = document.createElement("div");
        layout.className = "game-layout";
        const boardWrap = document.createElement("div");
        boardWrap.className = "board-wrap";
        this.boardGrid = document.createElement("div");
        this.boardGrid.className = "board-grid";
        boardWrap.appendChild(this.boardGrid);
        const panel = document.createElement("aside");
        panel.className = "panel";
        const statusTitle = document.createElement("h3");
        statusTitle.textContent = "局面信息";
        this.gameTurnText = document.createElement("p");
        this.gameTurnText.className = "text-small";
        this.gameHintText = document.createElement("p");
        this.gameHintText.className = "text-small";
        this.gameTurnEffectText = document.createElement("p");
        this.gameTurnEffectText.className = "text-small";
        this.gameSelectedEffectText = document.createElement("p");
        this.gameSelectedEffectText.className = "text-small";
        const carryTitle = document.createElement("h3");
        carryTitle.textContent = "本局携带";
        this.gameCarryList = document.createElement("div");
        this.gameCarryList.className = "marine-chip-list";
        const row = document.createElement("div");
        row.className = "btn-row";
        this.btnGameFinish = document.createElement("button");
        this.btnGameFinish.className = "btn btn-danger";
        this.btnGameFinish.textContent = "结束本局";
        this.btnGameHome = document.createElement("button");
        this.btnGameHome.className = "btn btn-secondary";
        this.btnGameHome.textContent = "返回首页";
        row.appendChild(this.btnGameFinish);
        row.appendChild(this.btnGameHome);
        panel.appendChild(statusTitle);
        panel.appendChild(this.gameTurnText);
        panel.appendChild(this.gameHintText);
        panel.appendChild(this.gameTurnEffectText);
        panel.appendChild(this.gameSelectedEffectText);
        panel.appendChild(carryTitle);
        panel.appendChild(this.gameCarryList);
        panel.appendChild(row);
        layout.appendChild(boardWrap);
        layout.appendChild(panel);
        screen.appendChild(layout);
        return screen;
    }

    /**
     * 结算页。
     * @returns {HTMLElement} 结算页元素。
     */
    createEndScreen() {
        const screen = document.createElement("section");
        screen.className = "screen display-none";
        screen.setAttribute("data-screen", "end");
        const title = document.createElement("h2");
        title.className = "title";
        title.textContent = "游戏结束";
        const box = document.createElement("div");
        box.className = "end-box";
        const scoreLabel = document.createElement("p");
        scoreLabel.className = "subtitle";
        scoreLabel.textContent = "本局分数";
        this.endScoreText = document.createElement("p");
        this.endScoreText.className = "end-score";
        this.endCarryText = document.createElement("p");
        this.endCarryText.className = "text-small";
        this.endDetailText = document.createElement("p");
        this.endDetailText.className = "text-small";
        box.appendChild(scoreLabel);
        box.appendChild(this.endScoreText);
        box.appendChild(this.endCarryText);
        box.appendChild(this.endDetailText);
        const row = document.createElement("div");
        row.className = "btn-row";
        this.btnEndBack = document.createElement("button");
        this.btnEndBack.className = "btn btn-primary";
        this.btnEndBack.textContent = "返回主菜单";
        row.appendChild(this.btnEndBack);
        screen.appendChild(title);
        screen.appendChild(box);
        screen.appendChild(row);
        return screen;
    }

    /**
     * 绑定事件。
     * @returns {void}
     */
    bindEvents() {
        const self = this;
        this.btnHomeStart.addEventListener("click", function() {
            self.loadSelectionFromCookie();
            self.showScreen("select");
        });
        this.btnHomeRule.addEventListener("click", function() {
            self.showScreen("rule");
        });
        this.btnRuleBack.addEventListener("click", function() {
            self.showScreen("home");
        });
        this.btnSelectBack.addEventListener("click", function() {
            self.showScreen("home");
        });
        this.btnSelectStart.addEventListener("click", function() {
            self.startGame();
        });
        this.btnGameFinish.addEventListener("click", function() {
            self.finishGame();
        });
        this.btnGameHome.addEventListener("click", function() {
            self.showScreen("home");
            self.updateHomeSummary();
        });
        this.btnEndBack.addEventListener("click", function() {
            self.showScreen("home");
            self.updateHomeSummary();
        });
    }

    /**
     * 界面切换。
     * @param {string} name 目标界面。
     * @returns {void}
     */
    showScreen(name) {
        const screens = [this.homeScreen, this.ruleScreen, this.selectScreen, this.gameScreen, this.endScreen];
        let i = 0;
        for (i = 0; i < screens.length; i += 1) {
            if (screens[i].getAttribute("data-screen") === name) {
                screens[i].classList.remove("display-none");
            } else {
                screens[i].classList.add("display-none");
            }
        }
    }

    /**
     * 读取上次海洋卡选择。
     * @returns {void}
     */
    loadSelectionFromCookie() {
        const lastSelected = this.cachedData.lastSelectedMarineIds || [];
        this.whaleOption.input.checked = this.inList(lastSelected, "whale");
        this.sharkOption.input.checked = this.inList(lastSelected, "shark");
    }

    /**
     * 开始一局。
     * @returns {void}
     */
    startGame() {
        STORE.selectedMarineIds = [];
        if (this.whaleOption.input.checked) {
            STORE.selectedMarineIds.push("whale");
        }
        if (this.sharkOption.input.checked) {
            STORE.selectedMarineIds.push("shark");
        }
        STORE.carriedMarineIds = STORE.selectedMarineIds.slice();
        STORE.board = this.createInitialBoard();
        STORE.selectedCell = -1;
        STORE.turnCount = 0;
        STORE.score = 0;
        STORE.isGameEnded = false;
        STORE.highlightedTargets = [];
        STORE.mode = "normal";
        STORE.pendingActionQueue = [];
        STORE.currentAction = null;
        STORE.actionSourceIndex = -1;
        STORE.turnPrepared = false;
        STORE.activeTurnEffects = null;
        STORE.pendingTurnEffects = null;
        this.cachedData.lastSelectedMarineIds = STORE.selectedMarineIds.slice();
        APP.CookieTool.setJSON(CONFIG.COOKIE_KEY, this.cachedData, 180);
        this.renderCarryList();
        this.renderBoard();
        this.refreshGamePanel("请选择捕食者。");
        this.showScreen("game");
    }

    /**
     * 初始地图。
     * @returns {Array} 地图数据。
     */
    createInitialBoard() {
        const values = [];
        let i = 0;
        for (i = 0; i < CONFIG.LAND_CARD_COUNT; i += 1) {
            values.push(String(i));
        }
        this.shuffle(values);
        const board = [];
        for (i = 0; i < values.length; i += 1) {
            board.push([values[i]]);
        }
        return board;
    }

    /**
     * 洗牌。
     * @param {Array} arr 数组。
     * @returns {void}
     */
    shuffle(arr) {
        let i = 0;
        let j = 0;
        let temp = "";
        for (i = arr.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    /**
     * 渲染地图。
     * @returns {void}
     */
    renderBoard() {
        const self = this;
        this.boardGrid.innerHTML = "";
        let index = 0;
        for (index = 0; index < STORE.board.length; index += 1) {
            const cell = document.createElement("button");
            cell.type = "button";
            cell.className = "board-cell cursor-pointer";
            cell.setAttribute("data-index", String(index));
            cell.addEventListener("click", function(event) {
                self.onCellClick(event);
            });
            if (STORE.board[index] && STORE.board[index].length > 0) {
                cell.classList.add("has-card");
                const stackSize = STORE.board[index].length;
                const topId = STORE.board[index][stackSize - 1];
                const cardNode = this.createCardNode(this.cardMap[topId], false, true);
                if (stackSize > 1) {
                    this.appendStackBadge(cardNode, stackSize);
                }
                cell.appendChild(cardNode);
            }
            this.boardGrid.appendChild(cell);
        }
        this.renderSelectionState();
    }

    /**
     * 地图点击入口。
     * @param {Event} event 点击事件。
     * @returns {void}
     */
    onCellClick(event) {
        if (STORE.isGameEnded) {
            return;
        }
        const index = Number(event.currentTarget.getAttribute("data-index"));
        if (STORE.mode === "normal") {
            this.handleNormalClick(index);
            return;
        }
        if (STORE.mode === "action_move") {
            this.handleActionMoveClick(index);
            return;
        }
        if (STORE.mode === "action_swap") {
            this.handleActionSwapClick(index);
            return;
        }
        if (STORE.mode === "action_remove_single") {
            this.handleActionRemoveSingleClick(index);
        }
    }

    /**
     * 普通捕食模式点击。
     * @param {number} index 点击索引。
     * @returns {void}
     */
    handleNormalClick(index) {
        const hasAnimal = this.hasAnimal(index);
        if (!STORE.turnPrepared) {
            STORE.activeTurnEffects = STORE.pendingTurnEffects;
            STORE.pendingTurnEffects = null;
            STORE.turnPrepared = true;
        }
        if (STORE.selectedCell === -1) {
            if (!hasAnimal) {
                this.refreshGamePanel("该位置为空，请选择有动物的格子。");
                return;
            }
            if (!this.canSelectPredator(index, STORE.activeTurnEffects)) {
                this.refreshGamePanel("受上一回合效果影响，该动物本回合不能作为捕食者。");
                return;
            }
            STORE.selectedCell = index;
            STORE.highlightedTargets = this.findEatTargets(index, STORE.activeTurnEffects);
            this.renderSelectionState();
            this.refreshGamePanel("已选捕食者，请点击可吃目标。");
            return;
        }
        if (index === STORE.selectedCell) {
            STORE.selectedCell = -1;
            STORE.highlightedTargets = [];
            this.renderSelectionState();
            this.refreshGamePanel("已取消选择。");
            return;
        }
        if (!hasAnimal) {
            this.refreshGamePanel("目标为空，不能捕食。");
            return;
        }
        if (!this.canEat(STORE.selectedCell, index, STORE.activeTurnEffects)) {
            if (this.canSelectPredator(index, STORE.activeTurnEffects)) {
                STORE.selectedCell = index;
                STORE.highlightedTargets = this.findEatTargets(index, STORE.activeTurnEffects);
                this.renderSelectionState();
                this.refreshGamePanel("该动作无效，已改选新的捕食者。");
                return;
            }
            this.refreshGamePanel("该捕食动作无效。");
            return;
        }
        this.performEat(STORE.selectedCell, index);
    }

    /**
     * 执行捕食并触发效果。
     * @param {number} predatorIndex 捕食者索引。
     * @param {number} preyIndex 猎物索引。
     * @returns {void}
     */
    performEat(predatorIndex, preyIndex) {
        const predatorStack = STORE.board[predatorIndex];
        const preyStack = STORE.board[preyIndex];
        const predatorTop = predatorStack[predatorStack.length - 1];
        const preyTop = preyStack[preyStack.length - 1];
        const diff = this.cardMap[predatorTop].value - this.cardMap[preyTop].value;
        STORE.board[preyIndex] = preyStack.concat(predatorStack);
        STORE.board[predatorIndex] = [];
        if (STORE.activeTurnEffects && STORE.activeTurnEffects.crocodileReturn) {
            STORE.board[predatorIndex] = STORE.board[preyIndex];
            STORE.board[preyIndex] = [];
            preyIndex = predatorIndex;
        }
        const resolved = APP.GameLogic.resolveAfterEat(predatorTop, predatorIndex, preyIndex, diff, STORE.activeTurnEffects);
        STORE.pendingTurnEffects = APP.GameLogic.mergePendingEffects(STORE.pendingTurnEffects, resolved.pendingTurnEffects);
        STORE.pendingActionQueue = resolved.actions.slice();
        STORE.selectedCell = -1;
        STORE.highlightedTargets = [];
        this.renderBoard();
        if (STORE.pendingActionQueue.length > 0) {
            this.startNextAction();
            return;
        }
        this.finishTurnFlow();
    }

    /**
     * 下一条效果行动。
     * @returns {void}
     */
    startNextAction() {
        STORE.currentAction = STORE.pendingActionQueue.shift();
        STORE.actionSourceIndex = -1;
        STORE.highlightedTargets = [];
        if (!STORE.currentAction) {
            this.finishTurnFlow();
            return;
        }
        if (STORE.currentAction.type === "move") {
            STORE.mode = "action_move";
            this.refreshGamePanel("发动移动效果：先选要移动的动物，再选目标空格。");
            return;
        }
        if (STORE.currentAction.type === "swap") {
            STORE.mode = "action_swap";
            this.refreshGamePanel("发动交换效果：依次选择两只动物。");
            return;
        }
        STORE.mode = "action_remove_single";
        this.refreshGamePanel("发动移除效果：选择一只堆叠层数为1的动物。");
    }

    /**
     * 移动效果点击。
     * @param {number} index 索引。
     * @returns {void}
     */
    handleActionMoveClick(index) {
        const action = STORE.currentAction;
        if (!action) {
            return;
        }
        if (STORE.actionSourceIndex === -1) {
            if (!this.hasAnimal(index)) {
                this.refreshGamePanel("先选择有动物的格子。");
                return;
            }
            if (action.sourceFixed !== -1 && action.sourceFixed !== index) {
                this.refreshGamePanel("该效果只能移动指定动物。");
                return;
            }
            STORE.actionSourceIndex = index;
            STORE.highlightedTargets = this.findMoveTargets(index, action.distanceOptions);
            this.renderSelectionState();
            this.refreshGamePanel("请选择目标空格。");
            return;
        }
        if (!this.isCellEmpty(index) || !this.canMoveByRule(STORE.actionSourceIndex, index, action.distanceOptions)) {
            this.refreshGamePanel("目标不合法。");
            return;
        }
        STORE.board[index] = STORE.board[STORE.actionSourceIndex];
        STORE.board[STORE.actionSourceIndex] = [];
        action.remaining -= 1;
        STORE.actionSourceIndex = -1;
        STORE.highlightedTargets = [];
        this.renderBoard();
        if (action.remaining > 0) {
            this.refreshGamePanel("继续选择下一只动物。");
            return;
        }
        this.finishCurrentAction();
    }

    /**
     * 交换效果点击。
     * @param {number} index 索引。
     * @returns {void}
     */
    handleActionSwapClick(index) {
        if (!this.hasAnimal(index)) {
            this.refreshGamePanel("请选择有动物的格子。");
            return;
        }
        if (STORE.actionSourceIndex === -1) {
            STORE.actionSourceIndex = index;
            STORE.highlightedTargets = this.findAllAnimalIndexesExcept(index);
            this.renderSelectionState();
            this.refreshGamePanel("请选择交换目标。");
            return;
        }
        if (STORE.actionSourceIndex === index) {
            return;
        }
        const temp = STORE.board[STORE.actionSourceIndex];
        STORE.board[STORE.actionSourceIndex] = STORE.board[index];
        STORE.board[index] = temp;
        STORE.currentAction.remaining -= 1;
        STORE.actionSourceIndex = -1;
        STORE.highlightedTargets = [];
        this.renderBoard();
        this.finishCurrentAction();
    }

    /**
     * 移除效果点击。
     * @param {number} index 索引。
     * @returns {void}
     */
    handleActionRemoveSingleClick(index) {
        const action = STORE.currentAction;
        if (!action || !this.hasAnimal(index) || STORE.board[index].length !== 1 || action.forbiddenIndex === index) {
            this.refreshGamePanel("只能移除单层且未进食动物。");
            return;
        }
        STORE.board[index] = [];
        action.remaining -= 1;
        this.renderBoard();
        this.finishCurrentAction();
    }

    /**
     * 完成当前效果行动。
     * @returns {void}
     */
    finishCurrentAction() {
        STORE.mode = "normal";
        STORE.currentAction = null;
        STORE.actionSourceIndex = -1;
        STORE.highlightedTargets = [];
        if (STORE.pendingActionQueue.length > 0) {
            this.startNextAction();
            return;
        }
        this.finishTurnFlow();
    }

    /**
     * 结束回合流程。
     * @returns {void}
     */
    finishTurnFlow() {
        STORE.turnCount += 1;
        STORE.turnPrepared = false;
        STORE.activeTurnEffects = null;
        STORE.selectedCell = -1;
        STORE.highlightedTargets = [];
        STORE.mode = "normal";
        STORE.pendingActionQueue = [];
        STORE.currentAction = null;
        STORE.actionSourceIndex = -1;
        this.renderSelectionState();
        if (!this.hasAnyValidMove(STORE.pendingTurnEffects)) {
            this.finishGame();
            return;
        }
        this.refreshGamePanel("回合结束。请选择下一回合捕食者。");
    }

    /**
     * 捕食者可选判定。
     * @param {number} predatorIndex 捕食者索引。
     * @param {Object|null} effects 回合效果。
     * @returns {boolean} 是否可选。
     */
    canSelectPredator(predatorIndex, effects) {
        if (!this.hasAnimal(predatorIndex)) {
            return false;
        }
        if (!effects || !effects.noPolarPredator) {
            return true;
        }
        const topId = STORE.board[predatorIndex][STORE.board[predatorIndex].length - 1];
        return topId !== "15";
    }

    /**
     * 捕食目标列表。
     * @param {number} predatorIndex 捕食者索引。
     * @param {Object|null} effects 回合效果。
     * @returns {Array} 目标列表。
     */
    findEatTargets(predatorIndex, effects) {
        const targets = [];
        let i = 0;
        for (i = 0; i < STORE.board.length; i += 1) {
            if (i !== predatorIndex && this.canEat(predatorIndex, i, effects)) {
                targets.push(i);
            }
        }
        return targets;
    }

    /**
     * 捕食判定。
     * @param {number} predatorIndex 捕食者索引。
     * @param {number} preyIndex 猎物索引。
     * @param {Object|null} effects 回合效果。
     * @returns {boolean} 是否可吃。
     */
    canEat(predatorIndex, preyIndex, effects) {
        if (!this.hasAnimal(predatorIndex) || !this.hasAnimal(preyIndex)) {
            return false;
        }
        if (!this.canSelectPredator(predatorIndex, effects)) {
            return false;
        }
        const predatorTop = STORE.board[predatorIndex][STORE.board[predatorIndex].length - 1];
        const preyTop = STORE.board[preyIndex][STORE.board[preyIndex].length - 1];
        const diff = this.cardMap[predatorTop].value - this.cardMap[preyTop].value;
        if (!effects) {
            return this.isAdjacent(predatorIndex, preyIndex) && diff >= 1 && diff <= 3;
        }
        if (effects.foxDiagonal && !this.isDiagonalAdjacent(predatorIndex, preyIndex)) {
            return false;
        }
        if (effects.lynxJump && !this.isOrthJumpOverOneAnimal(predatorIndex, preyIndex)) {
            return false;
        }
        if (effects.tigerTwoStep && !this.isOrthDistanceTwo(predatorIndex, preyIndex)) {
            return false;
        }
        if (!effects.foxDiagonal && !effects.lynxJump && !effects.tigerTwoStep && !this.isAdjacent(predatorIndex, preyIndex)) {
            return false;
        }
        if (effects.lionExactOne) {
            return diff === 1;
        }
        return diff >= 1 && diff <= 3;
    }

    /**
     * 合法行动检测。
     * @param {Object|null} effects 下回合效果。
     * @returns {boolean} 是否存在合法行动。
     */
    hasAnyValidMove(effects) {
        let i = 0;
        for (i = 0; i < STORE.board.length; i += 1) {
            if (this.canSelectPredator(i, effects) && this.findEatTargets(i, effects).length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 移动目标列表。
     * @param {number} fromIndex 起点。
     * @param {Array} distanceOptions 距离列表。
     * @returns {Array} 目标列表。
     */
    findMoveTargets(fromIndex, distanceOptions) {
        const list = [];
        let i = 0;
        for (i = 0; i < STORE.board.length; i += 1) {
            if (this.canMoveByRule(fromIndex, i, distanceOptions)) {
                list.push(i);
            }
        }
        return list;
    }

    /**
     * 移动规则判定。
     * @param {number} fromIndex 起点。
     * @param {number} toIndex 终点。
     * @param {Array} distanceOptions 距离列表。
     * @returns {boolean} 是否合法。
     */
    canMoveByRule(fromIndex, toIndex, distanceOptions) {
        if (!this.isCellEmpty(toIndex) || fromIndex === toIndex) {
            return false;
        }
        if (!distanceOptions || distanceOptions.length === 0) {
            return true;
        }
        return this.inList(distanceOptions, this.manhattanDistance(fromIndex, toIndex));
    }

    /**
     * 获取除某索引外的动物索引。
     * @param {number} exceptIndex 排除索引。
     * @returns {Array} 索引列表。
     */
    findAllAnimalIndexesExcept(exceptIndex) {
        const list = [];
        let i = 0;
        for (i = 0; i < STORE.board.length; i += 1) {
            if (i !== exceptIndex && this.hasAnimal(i)) {
                list.push(i);
            }
        }
        return list;
    }

    /**
     * 是否有动物。
     * @param {number} index 索引。
     * @returns {boolean} 是否有动物。
     */
    hasAnimal(index) {
        return !!(STORE.board[index] && STORE.board[index].length > 0);
    }

    /**
     * 是否空格。
     * @param {number} index 索引。
     * @returns {boolean} 是否为空。
     */
    isCellEmpty(index) {
        return !STORE.board[index] || STORE.board[index].length === 0;
    }

    /**
     * 正交相邻判定。
     * @param {number} a 索引A。
     * @param {number} b 索引B。
     * @returns {boolean} 是否正交相邻。
     */
    isAdjacent(a, b) {
        const ar = Math.floor(a / CONFIG.BOARD_COLS);
        const ac = a % CONFIG.BOARD_COLS;
        const br = Math.floor(b / CONFIG.BOARD_COLS);
        const bc = b % CONFIG.BOARD_COLS;
        return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
    }

    /**
     * 斜向相邻判定。
     * @param {number} a 索引A。
     * @param {number} b 索引B。
     * @returns {boolean} 是否斜向相邻。
     */
    isDiagonalAdjacent(a, b) {
        const ar = Math.floor(a / CONFIG.BOARD_COLS);
        const ac = a % CONFIG.BOARD_COLS;
        const br = Math.floor(b / CONFIG.BOARD_COLS);
        const bc = b % CONFIG.BOARD_COLS;
        return Math.abs(ar - br) === 1 && Math.abs(ac - bc) === 1;
    }

    /**
     * 正交距离2判定。
     * @param {number} a 索引A。
     * @param {number} b 索引B。
     * @returns {boolean} 是否满足。
     */
    isOrthDistanceTwo(a, b) {
        const ar = Math.floor(a / CONFIG.BOARD_COLS);
        const ac = a % CONFIG.BOARD_COLS;
        const br = Math.floor(b / CONFIG.BOARD_COLS);
        const bc = b % CONFIG.BOARD_COLS;
        return (ar === br && Math.abs(ac - bc) === 2) || (ac === bc && Math.abs(ar - br) === 2);
    }

    /**
     * 猞猁跳吃判定。
     * @param {number} predatorIndex 捕食者索引。
     * @param {number} preyIndex 猎物索引。
     * @returns {boolean} 是否满足。
     */
    isOrthJumpOverOneAnimal(predatorIndex, preyIndex) {
        if (!this.isOrthDistanceTwo(predatorIndex, preyIndex)) {
            return false;
        }
        const mid = this.getMiddleIndex(predatorIndex, preyIndex);
        return mid !== -1 && this.hasAnimal(mid);
    }

    /**
     * 获取中间格索引。
     * @param {number} a 索引A。
     * @param {number} b 索引B。
     * @returns {number} 中间格索引。
     */
    getMiddleIndex(a, b) {
        const ar = Math.floor(a / CONFIG.BOARD_COLS);
        const ac = a % CONFIG.BOARD_COLS;
        const br = Math.floor(b / CONFIG.BOARD_COLS);
        const bc = b % CONFIG.BOARD_COLS;
        if (ar === br && Math.abs(ac - bc) === 2) {
            return ar * CONFIG.BOARD_COLS + Math.floor((ac + bc) / 2);
        }
        if (ac === bc && Math.abs(ar - br) === 2) {
            return Math.floor((ar + br) / 2) * CONFIG.BOARD_COLS + ac;
        }
        return -1;
    }

    /**
     * 曼哈顿距离。
     * @param {number} a 索引A。
     * @param {number} b 索引B。
     * @returns {number} 距离。
     */
    manhattanDistance(a, b) {
        const ar = Math.floor(a / CONFIG.BOARD_COLS);
        const ac = a % CONFIG.BOARD_COLS;
        const br = Math.floor(b / CONFIG.BOARD_COLS);
        const bc = b % CONFIG.BOARD_COLS;
        return Math.abs(ar - br) + Math.abs(ac - bc);
    }

    /**
     * 渲染选中与高亮状态。
     * @returns {void}
     */
    renderSelectionState() {
        const nodes = this.boardGrid.querySelectorAll(".board-cell");
        let i = 0;
        for (i = 0; i < nodes.length; i += 1) {
            const idx = Number(nodes[i].getAttribute("data-index"));
            nodes[i].classList.remove("selected");
            nodes[i].classList.remove("can-eat");
            if (idx === STORE.selectedCell || idx === STORE.actionSourceIndex) {
                nodes[i].classList.add("selected");
            }
            if (this.inList(STORE.highlightedTargets, idx)) {
                nodes[i].classList.add("can-eat");
            }
        }
    }

    /**
     * 结算。
     * @returns {void}
     */
    finishGame() {
        const remaining = this.countRemainingStacks();
        STORE.score = 4 - remaining;
        STORE.isGameEnded = true;
        STORE.lastResult = { score: STORE.score, turns: STORE.turnCount, remaining: remaining, carriedMarineIds: STORE.carriedMarineIds.slice() };
        this.cachedData.lastResult = STORE.lastResult;
        this.cachedData.lastSelectedMarineIds = STORE.selectedMarineIds.slice();
        APP.CookieTool.setJSON(CONFIG.COOKIE_KEY, this.cachedData, 180);
        this.endScoreText.textContent = String(STORE.score);
        this.endCarryText.textContent = "本局携带海洋动物：" + this.formatMarineText(STORE.carriedMarineIds);
        this.endDetailText.textContent = "剩余动物堆：" + String(remaining) + "，总回合：" + String(STORE.turnCount);
        this.showScreen("end");
        this.updateHomeSummary();
    }

    /**
     * 剩余堆数。
     * @returns {number} 堆数。
     */
    countRemainingStacks() {
        let count = 0;
        let i = 0;
        for (i = 0; i < STORE.board.length; i += 1) {
            if (this.hasAnimal(i)) {
                count += 1;
            }
        }
        return count;
    }

    /**
     * 刷新局面文本。
     * @param {string} hint 提示。
     * @returns {void}
     */
    refreshGamePanel(hint) {
        const selectedText = STORE.selectedCell === -1 ? "无" : String(STORE.selectedCell + 1);
        this.gameTurnText.textContent = "回合: " + String(STORE.turnCount) + " | 当前选中: " + selectedText + " | 模式: " + STORE.mode;
        this.gameHintText.textContent = hint || "请选择行动。";
        this.gameTurnEffectText.textContent = "本回合受上一回合影响: " + APP.GameLogic.effectSummary(STORE.activeTurnEffects);
        this.gameSelectedEffectText.textContent = this.getSelectedAnimalEffectText();
    }

    /**
     * 选中动物效果文本。
     * @returns {string} 文本。
     */
    getSelectedAnimalEffectText() {
        if (STORE.selectedCell === -1 || !this.hasAnimal(STORE.selectedCell)) {
            return "选中动物效果：无";
        }
        const topId = STORE.board[STORE.selectedCell][STORE.board[STORE.selectedCell].length - 1];
        return "选中动物效果：" + this.cardMap[topId].name + " - " + APP.GameLogic.getEffectDesc(topId);
    }

    /**
     * 渲染携带列表。
     * @returns {void}
     */
    renderCarryList() {
        this.gameCarryList.innerHTML = "";
        if (STORE.carriedMarineIds.length === 0) {
            const chip = document.createElement("span");
            chip.className = "marine-chip";
            chip.textContent = "未携带";
            this.gameCarryList.appendChild(chip);
            return;
        }
        let i = 0;
        for (i = 0; i < STORE.carriedMarineIds.length; i += 1) {
            const chip = document.createElement("span");
            chip.className = "marine-chip";
            chip.textContent = this.cardMap[STORE.carriedMarineIds[i]].name;
            this.gameCarryList.appendChild(chip);
        }
    }

    /**
     * 更新首页记录。
     * @returns {void}
     */
    updateHomeSummary() {
        const result = this.cachedData.lastResult;
        if (!result) {
            this.homeSummary.textContent = "最近记录：暂无。";
            return;
        }
        this.homeSummary.textContent = "最近记录：分数 " + String(result.score) + "，携带 " + this.formatMarineText(result.carriedMarineIds);
    }

    /**
     * 携带文本格式化。
     * @param {Array} marineIds 海洋ID列表。
     * @returns {string} 文本。
     */
    formatMarineText(marineIds) {
        const names = [];
        let i = 0;
        for (i = 0; i < marineIds.length; i += 1) {
            if (this.cardMap[marineIds[i]]) {
                names.push(this.cardMap[marineIds[i]].name);
            }
        }
        if (names.length === 0) {
            return "无";
        }
        return names.join("、");
    }

    /**
     * 卡牌节点。
     * @param {Object} cardInfo 卡牌信息。
     * @param {boolean} small 小尺寸。
     * @param {boolean} showValue 显示数值。
     * @returns {HTMLElement} 节点。
     */
    createCardNode(cardInfo, small, showValue) {
        const card = document.createElement("div");
        card.className = small ? "card small" : "card";
        const imageUrl = cardInfo.sheet === "A" ? CONFIG.IMAGE_A : CONFIG.IMAGE_B;
        card.style.backgroundImage = "url('" + imageUrl + "')";
        card.style.backgroundSize = String(cardInfo.cols * 100) + "% " + String(cardInfo.rows * 100) + "%";
        card.style.backgroundPosition = String(this.toBackgroundPercent(cardInfo.col, cardInfo.cols)) + "% " + String(this.toBackgroundPercent(cardInfo.row, cardInfo.rows)) + "%";
        if (showValue && typeof cardInfo.value === "number") {
            this.appendValueBadge(card, cardInfo.value);
        }
        return card;
    }

    /**
     * 数值角标。
     * @param {HTMLElement} cardNode 节点。
     * @param {number} value 数值。
     * @returns {void}
     */
    appendValueBadge(cardNode, value) {
        const badge = document.createElement("span");
        badge.className = "card-badge";
        badge.textContent = String(value);
        cardNode.appendChild(badge);
    }

    /**
     * 堆叠角标。
     * @param {HTMLElement} cardNode 节点。
     * @param {number} stackSize 层数。
     * @returns {void}
     */
    appendStackBadge(cardNode, stackSize) {
        const badge = document.createElement("span");
        badge.className = "card-badge";
        badge.textContent = "x" + String(stackSize);
        cardNode.appendChild(badge);
    }

    /**
     * 精灵图百分比。
     * @param {number} index 索引。
     * @param {number} total 总数。
     * @returns {number} 百分比。
     */
    toBackgroundPercent(index, total) {
        if (total <= 1) {
            return 0;
        }
        return (index / (total - 1)) * 100;
    }

    /**
     * 数组包含判定。
     * @param {Array} list 数组。
     * @param {string|number} value 值。
     * @returns {boolean} 是否包含。
     */
    inList(list, value) {
        return list.indexOf(value) !== -1;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    APP.page = new Page();
});