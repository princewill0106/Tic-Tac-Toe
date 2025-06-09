const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");

const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let cells = Array(9).fill("");
let gameOver = false;

const HUMAN = "X";
const AI = "O";

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.dataset.index = index;
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", handleClick);
    board.appendChild(cellDiv);
  });
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (cells[index] !== "" || gameOver) return;

  cells[index] = HUMAN;
  moveSound.play();
  renderBoard();

  if (checkWin(HUMAN)) {
    highlightWin(HUMAN);
    statusText.textContent = "You win!";
    winSound.play();
    gameOver = true;
    return;
  } else if (isDraw()) {
    statusText.textContent = "It's a draw!";
    drawSound.play();
    gameOver = true;
    return;
  }

  statusText.textContent = "AI's turn...";
  setTimeout(() => {
    let bestMove = getBestMove();
    cells[bestMove] = AI;
    moveSound.play();
    renderBoard();

    if (checkWin(AI)) {
      highlightWin(AI);
      statusText.textContent = "AI wins!";
      winSound.play();
      gameOver = true;
    } else if (isDraw()) {
      statusText.textContent = "It's a draw!";
      drawSound.play();
      gameOver = true;
    } else {
      statusText.textContent = "Your turn (X)";
    }
  }, 400);
}

function highlightWin(player) {
  for (let combo of winCombos) {
    if (combo.every(index => cells[index] === player)) {
      combo.forEach(index => {
        document.querySelector(`.cell[data-index="${index}"]`).classList.add("win");
      });
      break;
    }
  }
}

function checkWin(player) {
  return winCombos.some(combo =>
    combo.every(index => cells[index] === player)
  );
}

function isDraw() {
  return cells.every(cell => cell !== "");
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === "") {
      cells[i] = AI;
      let score = minimax(cells, 0, false);
      cells[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWin(AI)) return 10 - depth;
  if (checkWin(HUMAN)) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = AI;
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = HUMAN;
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = "";
      }
    }
    return best;
  }
}

resetBtn.addEventListener("click", () => {
  cells = Array(9).fill("");
  gameOver = false;
  statusText.textContent = "Your turn (X)";
  renderBoard();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderBoard();
