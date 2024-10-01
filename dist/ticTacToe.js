import { updateTooltip } from './tooltip.js';

let chosenPlayer;

document.addEventListener('DOMContentLoaded', function () {
    loadPlayerValues();
    initializeGame();
});

function savePlayerValues() {
    const player1Value = document.getElementById('player1').value;
    const player2Value = document.getElementById('player2').value;
    localStorage.setItem('player1', player1Value);
    localStorage.setItem('player2', player2Value);
    updateTooltip(`${getCurrentPlayerName()}`);
}

function loadPlayerValues() {
    const player1Value = localStorage.getItem('player1');
    const player2Value = localStorage.getItem('player2');
    if (player1Value !== null) {
        document.getElementById('player1').value = player1Value;
    }
    if (player2Value !== null) {
        document.getElementById('player2').value = player2Value;
    }
}

document.getElementById('player1').addEventListener('input', savePlayerValues);
document.getElementById('player2').addEventListener('input', savePlayerValues);

function initializeGame() {
    const cells = document.querySelectorAll('.grid button');
    const resetButton = document.querySelector('.mt-10 button');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const xIcon = '<i class="fa-solid fa-xmark text-7xl text-stone-600 dark:text-white"></i>';
    const oIcon = '<i class="fa-regular fa-circle text-6xl text-stone-600 dark:text-white"></i>';
    let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        if (board[cellIndex] !== '' || !gameActive) {
            return;
        }

        board[cellIndex] = currentPlayer;
        cell.innerHTML = currentPlayer === 'X' ? xIcon : oIcon;

        if (checkWin()) {
            gameActive = false;
            updateTooltip(`${getCurrentPlayerName()} wins!`);
        } else if (board.every(cell => cell !== '')) {
            gameActive = false;
            updateTooltip('Draw!');
        } else {
            switchPlayer();
            updateTooltip(`${getCurrentPlayerName()}`);
        }
    }

    function checkWin() {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;

        // Assign a random player at the start of the game
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';

        cells.forEach(cell => cell.innerHTML = '');

        // Update the tooltip only for the starting player
        updateTooltip(`${getCurrentPlayerName()}`);
    }

    function getCurrentPlayerName() {
        if (currentPlayer === 'X') {
            return `${"❌"} ${player1Input.value}`;
        } else {
            return `${"⭕"} ${player2Input.value}`;
        }
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

    // Set the initial tooltip with player names and icons
    updateTooltip(`${getCurrentPlayerName()}`);
}