let cells = document.querySelectorAll('.cell');
let winner = document.querySelector('#winner');
let resetButton = document.querySelector('#resetButton');
let humanButton = document.querySelector('#vsHuman');
let botButton = document.querySelector('#vsBot');

let playerTag = true;
let vsBot = true;

let cellArray = Array.from(cells).map(cell => cell.textContent);
let row1 = cellArray.slice(0, 3);
let row2 = cellArray.slice(3, 6);
let row3 = cellArray.slice(6, 9);

let col1 = [cellArray[0], cellArray[3], cellArray[6]];
let col2 = [cellArray[1], cellArray[4], cellArray[7]];
let col3 = [cellArray[2], cellArray[5], cellArray[8]];

let winnerFlag = false;
let cellsFilledFlag = false;

resetButton.classList.add('buttonHover');

const updateGameState = () => {
    cellArray = Array.from(cells).map(cell => cell.textContent);
    row1 = cellArray.slice(0, 3);
    row2 = cellArray.slice(3, 6);
    row3 = cellArray.slice(6, 9);
    col1 = [cellArray[0], cellArray[3], cellArray[6]];
    col2 = [cellArray[1], cellArray[4], cellArray[7]];
    col3 = [cellArray[2], cellArray[5], cellArray[8]];
}


const botMove = function () {
    let emptyCells = Array.from(cells).filter(cell => {
        let content = cell.querySelector('.content');
        return content && content.textContent === '';
    });
    if (emptyCells.length > 0) {
        let bestMove = minimax(cellArray, true);
        let bestCell = cells[bestMove.index];
        let content = bestCell.querySelector('.content');
        content.textContent = 'X';
        content.classList.add('transition');
        content.classList.remove('content');
        playerTag = true;
        updateGameState();
        winCondition();
        drawCheck();
        buttonToggle();
    }
}


const buttonToggle = function () {
    if (winner.textContent != '' || cellArray.every(cell => cell === '' || cellArray.every(cell => cell !== ''))) {
        humanButton.disabled = false;
        botButton.disabled = false;
        humanButton.classList.add('buttonHover');
        botButton.classList.add('buttonHover');
    }
    else {
        humanButton.disabled = true;
        botButton.disabled = true;
        humanButton.classList.remove('buttonHover');
        botButton.classList.remove('buttonHover');
    }
}


const gameInit = function () {
    cells.forEach(cell => {
        let content = cell.querySelector('span');
        if (!content) {
            content = document.createElement('span');
            cell.appendChild(content);
        }
        content.textContent = '';
        content.className = 'content';
        cell.addEventListener('click', clickHandle);
        content.classList.add('content');
    });

    playerTag = true;
    winnerFlag = false;
    cellsFilledFlag = false;
    winner.textContent = '';

    updateGameState();
    buttonToggle();
}


resetButton.addEventListener('click', gameInit);
humanButton.addEventListener('click', function () {
    vsBot = false;
    gameInit();
})
botButton.addEventListener('click', function () {
    vsBot = true;
    gameInit();
})


const checkWin = function (board, player) {
    let winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}


const minimax = function (newBoard, isMaximizing) {
    let availableCells = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (checkWin(newBoard, 'O')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'X')) {
        return { score: 10 };
    } else if (availableCells.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availableCells.length; i++) {
        let move = {};
        move.index = availableCells[i];
        newBoard[availableCells[i]] = isMaximizing ? 'X' : 'O';

        let result = minimax(newBoard, !isMaximizing);
        move.score = result.score;

        newBoard[availableCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }
    return bestMove;
}


const clickHandle = function () {

    if (!winnerFlag) {

        let content = this.querySelector('.content');

        try {
            if (playerTag && content.textContent === '') {
                content.textContent = 'O';
                content.classList.add('transition');
                content.classList.remove('content');
                playerTag = false;
                if (!winnerFlag && vsBot) {
                    updateGameState();
                    winCondition();
                    drawCheck();
                    setTimeout(botMove, 500);
                }
            }


            else if (!playerTag && content.textContent === '' && !vsBot) {
                content.textContent = 'X';
                content.classList.add('transition');
                content.classList.remove('content');
                playerTag = true;
            }

            updateGameState();
            buttonToggle();
            winCondition();
            drawCheck();

        }

        catch {
            console.log('ERROR! THE CELL IS ALREADY FILLED');
        }

        updateGameState();
        winCondition();
        drawCheck();

        if (winnerFlag) {
            cells.forEach(cell => cell.removeEventListener('click', clickHandle));
        }
    }
}

gameInit();

cells.forEach(cell => cell.addEventListener('click', clickHandle));

const winCondition = function () {

    updateGameState();

    if ((row1.every(value => value === 'O')) || (row2.every(value => value === 'O')) || (row3.every(value => value === 'O')) ||
        (col1.every(value => value === 'O')) || (col2.every(value => value === 'O')) || (col2.every(value => value === 'O')) ||
        (cellArray[0] === 'O' && cellArray[4] === 'O' && cellArray[8] === 'O') ||
        (cellArray[2] === 'O' && cellArray[4] === 'O' && cellArray[6] === 'O')) { //vertical horizontal diagonal check for win
        winner.textContent = `Player 1 wins!`;
        console.log('p1 wins');
        winnerFlag = true;
    }

    else if ((row1.every(value => value === 'X')) || (row2.every(value => value === 'X')) || (row3.every(value => value === 'X')) ||
        (col1.every(value => value === 'X')) || (col2.every(value => value === 'X')) || (col2.every(value => value === 'X')) ||
        (cellArray[0] === 'X' && cellArray[4] === 'X' && cellArray[8] === 'X') ||
        (cellArray[2] === 'X' && cellArray[4] === 'X' && cellArray[6] === 'X')) { //vertical horizontal diagonal check for win
        winner.textContent = `Player 2 wins!`;
        console.log('p2 wins');
        winnerFlag = true;
    }

    winner.classList.add('transition');

}

const cellsFilled = function () {
    updateGameState();
    return cellArray.every(cell => cell !== '');
}


const drawCheck = function () {
    updateGameState();
    cellsFilledFlag = cellsFilled();
    if (cellsFilledFlag && !winnerFlag) {
        winner.textContent = 'Draw!';
        winner.classList.add('transition');
    }
}