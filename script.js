const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-btn');
const modeSelect = document.getElementById('mode-select');
const difficultySelect = document.getElementById('difficulty');
const gameMessage = document.getElementById('game-message');

let currentPlayer = 'X'; // Player is 'X'
let gameBoard = ['', '', '', '', '', '', '', '', '']; // 3x3 grid
let gameActive = true;
let isAI = false; // If true, AI is involved, if false, it's Player vs Player

// Create the game board dynamically
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    board.appendChild(cell);
}

// Handle player click events
board.addEventListener('click', (e) => {
    if (!gameActive) return;
    const clickedCell = e.target;
    if (clickedCell.classList.contains('cell') && clickedCell.textContent === '') {
        const index = clickedCell.dataset.index;
        gameBoard[index] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        if (checkWinner()) {
            displayMessage(`${currentPlayer} wins!`);
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            displayMessage("It's a tie!");
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch turn
            if (isAI && currentPlayer === 'O') {
                aiMove();
            }
        }
    }
});

// Display game message
function displayMessage(message) {
    gameMessage.textContent = message;
    gameMessage.style.display = 'block'; // Make message visible
}

// AI move (easy or hard)
function aiMove() {
    let move;
    if (difficultySelect.value === 'easy') {
        move = easyMove();
    } else {
        move = hardMove();
    }

    gameBoard[move] = 'O';
    document.querySelector(`[data-index="${move}"]`).textContent = 'O';

    if (checkWinner()) {
        displayMessage("AI wins!");
        gameActive = false;
    } else if (gameBoard.every(cell => cell !== '')) {
        displayMessage("It's a tie!");
        gameActive = false;
    } else {
        currentPlayer = 'X';
    }
}

// Easy AI - Random move
function easyMove() {
    const emptyCells = gameBoard
        .map((val, index) => val === '' ? index : null)
        .filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Hard AI - Minimax algorithm
function hardMove() {
    const bestMove = minimax(gameBoard, 'O');
    return bestMove.index;
}

// Minimax algorithm for AI decision making
function minimax(board, player) {
    const winner = checkWinner(board);
    if (winner === 'X') return { score: -1 };
    if (winner === 'O') return { score: 1 };
    if (board.every(cell => cell !== '')) return { score: 0 };

    const moves = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = player;
            const score = minimax(board, player === 'O' ? 'X' : 'O').score;
            moves.push({ index: i, score });
            board[i] = '';
        }
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

// Check if there is a winner
function checkWinner(board = gameBoard) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Reset the game
resetButton.addEventListener('click', () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    isAI = modeSelect.value === 'ai';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });
    gameMessage.style.display = 'none'; // Hide message when resetting the game
});

// Mode selection event
modeSelect.addEventListener('change', () => {
    isAI = modeSelect.value === 'ai';
    difficultySelect.disabled = !isAI;
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });
    gameMessage.style.display = 'none'; // Hide message when changing mode
});
