window.onload = function(){
    let score = 0;
    let best = [];
    let moves = 0;
    let size = 4;
    let itemPositions = [];
    let unitedSideItems = [];
    let unitedMainItems = [];
    let newItems = [];
    let isGameover = false;
    let bestsScores = [];
    let userName = "You";

    // CONST GET FROM DOCUMENT ================================================

    const scoreText = document.querySelector("#score-number");
    const movesText = document.querySelector("#moves-number");
    const board = document.querySelector(".board");
    const restartButton = Array.from(document.querySelectorAll(".btn__restart"));
    const modalGameover = document.querySelector("#gameover-dialog");
    const modalScorelist = document.querySelector("#scorelist-dialog");
    const btnBests = document.querySelector("#btn_bests");
    const btnCloseBests = document.querySelector("#scorelist_close");
    const scoreList = document.querySelector(".scorelist_list");

    // NEW ITEM ===============================================================

    // создание новой клетки
    function generateNewItem(){
        let freePositions = [];
        for(let y = 0; y < itemPositions.length; y++){
            for(let x = 0; x < itemPositions[y].length; x++){
                if(itemPositions[y][x].value == 0){
                    freePositions.push([x,y]);
                }
            }
        }
        let randomIndex = Math.floor(Math.random() * freePositions.length);
        let x = freePositions[randomIndex][0];
        let y = freePositions[randomIndex][1];
        let newItem = document.createElement('div');
        newItem.className = "board_item board_item__2";
        newItem.innerHTML = "2";
        board.append(newItem);
        newItems.push(newItem);
        return {
            position: [x,y],
            value: 2,
            item: newItem
        };
    }

    // Добавление клетки к общему пулу клоеток
    function pushNewItem(obj){
        let y = obj.position[1];
        let x = obj.position[0]
        itemPositions[y][x].value = obj.value;
        itemPositions[y][x].item = obj.item;
    }

    // MOVING =============================================================

    function switchPosition(direction){
        let isMoved = false;
        switch(direction){
            case "UP":
                for(let y = 1; y < itemPositions.length; y++){
                    for(let x = 0; x < itemPositions[y].length; x++){
                        if(itemPositions[y][x].value == 0) continue;
                        for(let mY = y; mY > 0; mY--){
                            if(itemPositions[mY-1][x].value == 0){
                                itemPositions[mY-1][x] = itemPositions[mY][x];
                                itemPositions[mY][x] = {value:0, item:undefined}
                                isMoved = true;
                            }
                            if(itemPositions[mY-1][x].value == itemPositions[mY][x].value &&
                                !itemPositions[mY-1][x].isUnit &&
                                !itemPositions[mY][x].isUnit){
                                score += itemPositions[mY-1][x].value;
                                unitedMainItems.push(itemPositions[mY-1][x].item);
                                itemPositions[mY-1][x].value *= 2;
                                itemPositions[mY-1][x].isUnit = true;
                                unitedSideItems.push([itemPositions[mY][x],mY-1,x]);
                                itemPositions[mY][x] = {value:0, item:undefined}
                                isMoved = true;
                            }

                        }
                    }
                }
                break;
            case "DOWN":
                for(let y = itemPositions.length - 2; y >= 0; y--){
                    for(let x = 0; x < itemPositions[y].length; x++){
                        if(itemPositions[y][x].value == 0) continue;
                        for(let mY = y; mY < itemPositions.length - 1; mY++){
                            if(itemPositions[mY+1][x].value == 0){
                                itemPositions[mY+1][x] = itemPositions[mY][x];
                                itemPositions[mY][x] = {value:0, item:undefined}
                                isMoved = true;
                            }
                            if(itemPositions[mY+1][x].value == itemPositions[mY][x].value &&
                                !itemPositions[mY+1][x].isUnit &&
                                !itemPositions[mY][x].isUnit){
                                score += itemPositions[mY+1][x].value;
                                unitedMainItems.push(itemPositions[mY+1][x].item);
                                itemPositions[mY+1][x].value *= 2;
                                itemPositions[mY+1][x].isUnit = true;
                                unitedSideItems.push([itemPositions[mY][x],mY+1,x]);
                                itemPositions[mY][x] = {value:0, item:undefined}
                                isMoved = true;
                            }

                        }
                    }
                }
                break;
            case "LEFT":
                for(let y = 0; y < itemPositions.length; y++){
                    for(let x = 1; x < itemPositions[y].length; x++){
                        if(itemPositions[y][x].value == 0) continue;
                        for(let mX = x; mX > 0; mX--){
                            if(itemPositions[y][mX-1].value == 0){
                                itemPositions[y][mX-1] = itemPositions[y][mX];
                                itemPositions[y][mX] = {value:0, item:undefined}
                                isMoved = true;
                            }
                            if(itemPositions[y][mX-1].value == itemPositions[y][mX].value &&
                                !itemPositions[y][mX-1].isUnit &&
                                !itemPositions[y][mX].isUnit){
                                score += itemPositions[y][mX-1].value;
                                unitedMainItems.push(itemPositions[y][mX-1].item);
                                itemPositions[y][mX-1].value *= 2;
                                itemPositions[y][mX-1].isUnit = true;
                                unitedSideItems.push([itemPositions[y][mX],y,mX-1]);
                                itemPositions[y][mX] = {value:0, item:undefined}
                                isMoved = true;
                            }
                        }
                    }
                }
                break;
            case "RIGHT":
                for(let y = 0; y < itemPositions.length; y++){
                    for(let x = itemPositions[y].length - 2; x >= 0; x--){
                        if(itemPositions[y][x].value == 0) continue;
                        for(let mX = x; mX < itemPositions[y].length - 1; mX++){
                            if(itemPositions[y][mX+1].value == 0){
                                itemPositions[y][mX+1] = itemPositions[y][mX];
                                itemPositions[y][mX] = {value:0, item:undefined}
                                isMoved = true;
                            }
                            if(itemPositions[y][mX+1].value == itemPositions[y][mX].value &&
                                !itemPositions[y][mX+1].isUnit &&
                                !itemPositions[y][mX].isUnit){
                                score += itemPositions[y][mX+1].value;
                                unitedMainItems.push(itemPositions[y][mX+1].item);
                                itemPositions[y][mX+1].value *= 2;
                                itemPositions[y][mX+1].isUnit = true;
                                unitedSideItems.push([itemPositions[y][mX],y,mX+1]);
                                itemPositions[y][mX] = {value:0, item:undefined}
                                isMoved = true;
                            }
                        }
                    }
                }
                break;
        }
        cleanAllUnit();
        return isMoved;
    }

    // обнуоение параметра слияния всех клеток
    function cleanAllUnit(){
        for(let y = 0; y < itemPositions.length; y++){
            for(let x = 0; x < itemPositions[y].length; x++){
                itemPositions[y][x].isUnit = false;
            }
        }
    }

    // GRAFICS ================================================================

    function drowItems(){
        // прорисовка движения всех клеток на поле
        for(let y = 0; y < itemPositions.length; y++){
            for(let x = 0; x < itemPositions[y].length; x++){
                if(itemPositions[y][x].value != 0){
                    itemPositions[y][x].item.style.transform = `translate(${20 * (x + 1) + 100 * x}px , ${20 * (y + 1) + 100 * y}px)`;
                    itemPositions[y][x].item.className = `board_item board_item__${itemPositions[y][x].value}`;
                    itemPositions[y][x].item.innerHTML = itemPositions[y][x].value;
                }
            }
        }
        // анимация донорских клеток при соединении и их уничтожение
        for(let i = 0; i < unitedSideItems.length; i++){
            unitedSideItems[i][0].item.style.transform = `translate(${20 * (unitedSideItems[i][2] + 1) + 100 * unitedSideItems[i][2]}px , ${20 * (unitedSideItems[i][1] + 1) + 100 * unitedSideItems[i][1]}px)`;
            unitedSideItems[i][0].item.className = `board_item board_item__hidden board_item__${unitedSideItems[i][0].value}`;
            unitedSideItems[i][0].item.innerHTML = unitedSideItems[i][0].value;
            let removedItem = unitedSideItems[i][0].item;
            setTimeout(() => removedItem.remove(), 100);
        }
        // анимация повышения ранга клеток
        for(let i = 0; i < unitedMainItems.length; i++){
            let scaleItem = unitedMainItems[i];
            scaleItem.style.transform += "scale(1.1)";
            setTimeout(() => scaleItem.style.transform = scaleItem.style.transform.replace("scale(1.1)", "scale(1)"), 100);
        }
        // анимация появления новых клеток
        for(let i = 0; i < newItems.length; i++){
            let newItem = newItems[i];
            newItem.style.transform += "scale(0)";
            setTimeout(() => newItem.style.transform = newItem.style.transform.replace("scale(0)", "scale(1)"), 100);
        }

        newItems = [];
        unitedSideItems = [];
        unitedMainItems = [];
    }

    function drowAllScores(){
        scoreList.innerHTML = "";
        for (let i = 0; i < bestsScores.length; i++) {
            let item = bestsScores[i];
            let newItem = document.createElement('li');
            let newItemName = document.createElement('div');
            let newItemScore = document.createElement('div');
            newItem.className = "scorelist_item";
            newItemName.className = "scorelist_name";
            newItemScore.className = "scorelist_score";
            newItemName.innerHTML = item["name"];
            newItemScore.innerHTML = item["score"];

            newItem.append(newItemName);
            newItem.append(newItemScore);
            scoreList.append(newItem);
        }
    }

    // вывод статистики на экран
    function drowAllStats(){
        scoreText.innerHTML = score;
        movesText.innerHTML = moves;
    }

    // заполнение поля пустыми клетками
    function createItemPosition(){
        for(let y = 0; y < size; y++){
            itemPositions.push([]);
            for(let x = 0; x < size; x++){
                itemPositions[y].push({value:0, item: undefined, isUnit: false});
            }
        }
    }

    // START ===============================================================

    createItemPosition();
    pushNewItem(generateNewItem());
    pushNewItem(generateNewItem());
    drowItems();
    reloadScores().then(() => drowAllScores());


    async function reloadScores(){
        if(bestsScores.length == 0){
            let resp = await fetch("/scores.json");
            let respJson = await resp.json();
            bestsScores = respJson["bests"]
            console.log("lol");
            return;
        }
        else return;
    }

    function checkScoreBit(){
        reloadScores().then(() => {
            names = bestsScores.map((item) => item["name"]);
            if(names.indexOf(userName) != -1){
                let index = names.indexOf(userName);
                if(bestsScores[index]["score"] < score){
                    bestsScores[index]["score"] = score;
                }
                for(let i = index; i >= 0; i--){
                    if(score > bestsScores[i]["score"]){
                        if(i != bestsScores.length - 1){
                            bestsScores[i+1]["name"] = bestsScores[i]["name"];        
                            bestsScores[i+1]["score"] = bestsScores[i]["score"];
                        }
                        bestsScores[i]["name"] = userName;        
                        bestsScores[i]["score"] = score;
                    }
                }
                drowAllScores();
                return
            }
            for(let i = bestsScores.length - 1; i >= 0; i--){
                if(score > bestsScores[i]["score"]){
                    if(i != bestsScores.length - 1){
                        bestsScores[i+1]["name"] = bestsScores[i]["name"];        
                        bestsScores[i+1]["score"] = bestsScores[i]["score"];
                    }
                    bestsScores[i]["name"] = userName;        
                    bestsScores[i]["score"] = score;
                }
            }
            drowAllScores();
        });
    }

    // GAMEOVER =============================================================

    function checkGameOver(){
        for(let y = 0; y < itemPositions.length; y++){
            for(let x = 0; x < itemPositions[y].length; x++){
                let currentValue = itemPositions[y][x].value;
                if(currentValue == 0){
                    return false;
                }
                let isValidRight = (x + 1 < itemPositions[x].length) ? itemPositions[y][x+1].value == currentValue : false;
                let isValidLeft = (x - 1 >= 0) ? itemPositions[y][x-1].value == currentValue : false;
                let isValidUp = (y - 1 >= 0) ? itemPositions[y-1][x].value == currentValue : false;
                let isValidDown = (y + 1 < itemPositions.length) ? itemPositions[y+1][x].value == currentValue : false;
                if(isValidRight || isValidLeft || isValidUp || isValidDown){
                    return false;
                }
            }
        }
        return true;
    }

    // LISTENERS ============================================================

    //управление игры
    document.addEventListener('keyup', (event) => {
        if(isGameover) return;
        switch(event.key){
            case "ArrowUp":
                if(switchPosition("UP")){
                    pushNewItem(generateNewItem());
                    moves++;
                }
                drowItems();
                drowAllStats();
                if(checkGameOver()){
                    isGameover = true;
                    modalGameover.showModal();
                    checkScoreBit();
                }
                break;
            case "ArrowDown":
                if(switchPosition("DOWN")){
                    pushNewItem(generateNewItem());
                    moves++;
                }
                drowItems();
                drowAllStats();
                if(checkGameOver()){
                    isGameover = true;
                    modalGameover.showModal();
                    checkScoreBit();
                }
                break;
            case "ArrowLeft":
                if(switchPosition("LEFT")){
                    pushNewItem(generateNewItem());
                    moves++;
                }
                drowItems();
                drowAllStats();
                if(checkGameOver()){
                    isGameover = true;
                    modalGameover.showModal();
                    checkScoreBit();
                }
                break;
            case "ArrowRight":
                if(switchPosition("RIGHT")){
                    pushNewItem(generateNewItem());
                    moves++;
                }
                drowItems();
                drowAllStats();
                if(checkGameOver()){
                    isGameover = true;
                    modalGameover.showModal();
                    checkScoreBit();
                }
                break;
        }
    });

    // рестарт игры
    restartButton.map((a) => a.addEventListener("click", (event) => {
        itemPositions = [];
        Array.from(document.querySelectorAll(".board_item")).map((a) => a.remove());
        score = 0;
        moves = 0;
        createItemPosition();
        pushNewItem(generateNewItem());
        pushNewItem(generateNewItem());
        drowAllStats();
        drowItems();
        modalGameover.close();
        isGameover = false;
    }));

    // показать лучшие результаты
    btnBests.addEventListener("click", (event) => {
        modalScorelist.showModal();
    });

    // скрыть лучие результаты
    btnCloseBests.addEventListener("click", (event) => {
        modalScorelist.close();
    });
};