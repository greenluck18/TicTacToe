let startMessage = document.getElementById("startMessage")
const yesBtn = document.getElementById("yesBtn").focus();
var origBoard;
var replay = false;
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
let huPlayer;
let aiPlayer;
let firstStep;
let lastSquare = "0";
const WinCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [1, 4, 7],
    [6, 4, 2],
    [0, 4, 8]
]

function getRandomInt(arr) {
    let A1 = Math.random()
    let A2 = arr.length - 1
    let B1 = Math.floor(A1 * A2)

    return arr[B1];
}

function createCell() {
    document.getElementById("gameMessage").innerHTML = `<div class="textUser"></div>
    <input type="button" id="replaybtn" value="Replay">`
    if (document.getElementsByClassName("cell").length > 0) {
        let cellElement = document.getElementsByClassName("cell")
        let cell = Array.from(cellElement)
        for (var i = 0; i < cell.length; i++) {
            document.getElementById(i).style.display = 'flex';
        }
        document.querySelector(".game-message").style.display = "block";
    } else {
        document.getElementById("board").innerHTML = `<div class="cell" id="0" data-cell></div>
    <div class="cell" id="1" data-cell></div>
    <div class="cell" id="2" data-cell></div>
    <div class="cell" id="3" data-cell></div>
    <div class="cell" id="4" data-cell></div>
    <div class="cell" id="5" data-cell></div>
    <div class="cell" id="6" data-cell></div>
    <div class="cell" id="7" data-cell></div>
    <div class="cell" id="8" data-cell></div>`
    }
    startGame();
}

document.onkeydown = function (event) {
    if (event.code == "Enter" && (event.target.id == "yesBtn")) {
        document.getElementById("startMessage").style.display = "none";
        displayAdv()
        //createCell()
    }
    else if (event.code == "Enter" && event.target.id == "noBtn") {
        window.open("https://www.google.com/").focus();
    }
    else if (event.code == "ArrowRight") {
        document.getElementById("noBtn").focus();
    }
    else if (event.code == "ArrowLeft") {
        document.getElementById("yesBtn").focus();
    }
}

function addScript(src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false; // чтобы гарантировать порядок
    document.head.appendChild(script);
}


function displayAdv() {
    document.getElementById('page-content').style.display = 'block'
    addScript("/static/scripts/adv.js")
}

function startGame() {
    firstStep = Math.random() < 0.5
    cellElements = document.getElementsByClassName("cell")
    cells = Array.from(cellElements)

    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());

    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove(X_CLASS);
        cells[i].classList.remove(CIRCLE_CLASS);
        cells[i].classList.remove("active");
        cells[i].style.removeProperty('background-color');
    }
    document.onkeydown = function (e) {

        if (lastSquare < 0 || lastSquare > 8)
            lastSquare = 0

        document.getElementById(lastSquare).classList.remove("active");
        document.getElementById("0").classList.remove("active");
        if (e.code == "ArrowUp") {
           
            if (lastSquare == 0 || lastSquare == 1 || lastSquare == 2) {
                replay = true
            } else {
                console.log(+lastSquare - 3)
                lastSquare = +lastSquare - 3
            }
        }
        else if (e.code == "ArrowDown" && (lastSquare !== 6 && lastSquare !== 7 && lastSquare !== 8)) {
            console.log(+lastSquare + 3)
            replay = false
            lastSquare = +lastSquare + 3
        }
        else if (e.code == "ArrowLeft" && (lastSquare !== 0 && lastSquare !== 3 && lastSquare !== 6)) {
            console.log(+lastSquare--)
            replay = false
            lastSquare = lastSquare--
        }
        else if (e.code == "ArrowRight" && (lastSquare !== 2 && lastSquare !== 5 && lastSquare !== 8)) {
            console.log(+lastSquare++)
            replay = false
            lastSquare = lastSquare++
        }
        if (replay) {
            document.getElementById("replaybtn").focus();
            if (e.code == "Enter") {
                startGame()
            }
        } else {
            document.getElementById("replaybtn").blur();
            document.getElementById(lastSquare).classList.add("active")
            if (e.code == "Enter") {

                document.getElementById(lastSquare).classList.remove("active");
                turnClick(lastSquare)
            }
        }
    }

    huPlayer = X_CLASS
    aiPlayer = CIRCLE_CLASS
    if (firstStep === true) {
        document.querySelector(".textUser").innerText = "Computer Start";

        huPlayer = CIRCLE_CLASS
        aiPlayer = X_CLASS

        computerStep()
    }
    else {
        document.querySelector(".textUser").innerText = "User Start";
        document.getElementById("0").classList.add("active")
    }

}


function computerStep() {
    let gameWon1 = checkWin(origBoard, huPlayer)
    if (gameWon1) gameOver(gameWon1)
    else {
        var a = bestSpot()
        if (!checkTie()) {
            turn(a, aiPlayer);
            document.getElementById(a).classList.add("active")
        }
    }
}

function turnClick(square) {
    if (typeof origBoard[square] == 'number') {
        turn(square, huPlayer)
        computerStep()
    }
}

function turn(squareId, player) {
    let gameWon1 = checkWin(origBoard, player)
    if (gameWon1) gameOver(gameWon1)
    else {
        origBoard[squareId] = player;
        lastSquare = squareId
        document.getElementById(squareId).classList.add(player)
        let gameWon = checkWin(origBoard, player)
        if (gameWon) gameOver(gameWon)
    }
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return computerMove(origBoard, aiPlayer)
}

function checkTie() {
    if (emptySquares().length == 0 || emptySquares().length == 1) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
        }
        declareWinner("Tie Game!")
        document.getElementById("restart").focus();
        return true;
    }
    return false;
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of WinCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of WinCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
    document.getElementById("restart").focus();
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
    document.querySelector(".game-message").style.display = "none";

    document.onkeydown = function (event) {
        if (event.code == "Enter" && (event.target.id == "restart")) {
            document.querySelector(".endgame").style.display = "none";
            for (var i = 0; i < cells.length; i++) {
                cells[i].classList.remove(X_CLASS);
                cells[i].classList.remove(CIRCLE_CLASS);
                cells[i].classList.remove("active");
                cells[i].style.removeProperty('background-color');
                cells[i].style.display = "none"
            }
            lastSquare = "0"
            displayAdv()
        }
        else if (event.code == "Enter" && event.target.id == "noBtn2") {

            window.open("https://www.google.com/", '_blank').focus();
        }
        else if (event.code == "ArrowRight") {
            document.getElementById("noBtn2").focus();
        }
        else if (event.code == "ArrowLeft") {
            document.getElementById("restart").focus();
        }
    }
}

function computerMove(newBoard, player) {
    let plays = newBoard.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);

    let emptyCells = emptySquares()
    let index1 = []
    let matched
    for (let [index, win] of WinCombinations.entries()) {
        matched = win.filter(el => plays.indexOf(el) > -1);
        if (matched.length == 2) {
            index = win.filter(el => plays.indexOf(el) == -1);
            index1.push(index[0])
        }
    }
    if (index1.length > 0) {
        index1 = emptyCells.map(el => {
            for (let i = 0; i < index1.length; i++) {
                if (index1[i] == el) {
                    return el
                } else {
                    return -1
                }
            }
        })
    }
    index1 = index1.filter(el => el != -1);
    if (index1.length > 1) {
        return getRandomInt(index1)
    } else if (index1.length == 1) {
        return index1
    } else {
        return getRandomInt(emptyCells)
    }

}
