document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('.grid button');
    const resetButton = document.querySelector('.mt-10 button');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const xIcon = '<i class="fa-solid fa-xmark text-7xl text-stone-600 dark:text-white"></i>';
    const oIcon = '<i class="fa-regular fa-circle text-6xl text-stone-600 dark:text-white"></i>';
    let currentPlayer = xIcon;
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        if (board[cellIndex] !== '' || !gameActive) {
            return;
        }

        board[cellIndex] = currentPlayer;
        cell.innerHTML = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            updateTooltip(`${getCurrentPlayerName()} wins!`);
        } else if (board.every(cell => cell !== '')) {
            gameActive = false;
            updateTooltip('Draw!');
        } else {
            currentPlayer = currentPlayer === xIcon ? oIcon : xIcon;
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

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = xIcon;
        cells.forEach(cell => cell.innerHTML = '');
        updateTooltip(`${getCurrentPlayerName()}`);
    }

    function updateTooltip(message) {
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = message;
    }

    function getCurrentPlayerName() {
        if (currentPlayer === xIcon) {
            return `${"❌"} ${player1Input.value}`;
        } else {
            return `${"⭕"} ${player2Input.value}`;
        }
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

    // Imposta il tooltip iniziale con i nomi dei giocatori e le icone
    updateTooltip(`${getCurrentPlayerName()}`);
});