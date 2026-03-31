function GameBoard() {
  const rows = 3;
  const columns = 3;
  let board = [];
  let lastPlacedMark;

  const printBoard = () => {
    for (let i = 0; i < rows; i++) {
      let row = "";
      for (let j = 0; j < columns; j++) {
        let cell = board[i][j];
        if (board[i][j] === "") {
          cell = " ";
        }
        if (j !== 0) {
          row += " | ";
        }
        row += cell;
      }
      if (i !== 0) {
        console.log("---------");
      }
      console.log(row);
    }
    console.log(" ");
  };

  function initializeBoard() {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = "";
      }
    }
  }

  function placingMark(row, column, mark) {
    if (!(mark === "x" || mark === "o")) {
      return "invalid input";
    }

    if (!row || !column) {
      return "invalid input";
    }

    row = Number(row);
    column = Number(column);

    if (row < 0 || row > 2 || column < 0 || column > 2) {
      return "out of bounds";
    }

    if (board[row][column] !== "") {
      return "occupied";
    }

    board[row][column] = mark;
    lastPlacedMark = [row, column];
  }

  function gameOver() {
    const [markRow, markColumn] = lastPlacedMark;
    const mark = board[markRow][markColumn];

    let sum = 0;
    for (let i = 0; i < rows; i++) {
      if (board[i][markColumn] === mark) {
        sum++;
      } else {
        break;
      }
    }
    if (sum === 3) {
      return true;
    }

    sum = 0;
    for (let i = 0; i < columns; i++) {
      if (board[markRow][i] === mark) {
        sum++;
      } else {
        break;
      }
    }
    if (sum === 3) {
      return true;
    }

    sum = 0;
    if (markRow === markColumn) {
      for (let i = 0; i < rows; i++) {
        if (board[i][i] === mark) {
          sum++;
        }
      }
    }
    if (sum === 3) {
      return true;
    }

    if (markRow + markColumn === 2) {
      if (
        board[0][2] === mark &&
        board[1][1] === mark &&
        board[2][0] === mark
      ) {
        return true;
      }
    }

    return false;
  }

  return { printBoard, initializeBoard, placingMark, gameOver };
}

function Player(name, mark) {
  const playerName = name;
  const playerMark = mark;

  const getPlayerName = () => playerName;
  const getPlayerMark = () => playerMark;

  return { getPlayerMark, getPlayerName };
}

function GameController(firstPlayerName, secondPlayerName) {
  const game = GameBoard();

  let playing;
  let waiting;

  let turns;

  const initializeGame = () => {
    game.initializeBoard();

    const firstPlayer = Player(firstPlayerName, "x");
    const secondPlayer = Player(secondPlayerName, "o");

    playing = firstPlayer;
    waiting = secondPlayer;
    turns = 0;
    initializeRematch();
  };

  const playersExist = () => {
    return firstPlayer && secondPlayer;
  };

  function playerTurn(row, column) {
    let message = game.placingMark(row, column, playing.getPlayerMark());
    if (message) {
      alert("no no, you can't do that - " + message);
    } else {
      let mark = playing.getPlayerMark();
      [playing, waiting] = [waiting, playing];
      turns++;
      return mark;
    }
  }

  function isGameOver() {
    if (turns === 9 && !game.gameOver()) {
      return "tie";
    }
    if (game.gameOver()) {
      return waiting.getPlayerName();
    }

    return false;
  }

  return { initializeGame, playerTurn, isGameOver };
}

function renderBoard() {
  const container = document.querySelector(".container");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const button = document.createElement("button");
      button.dataset.row = i;
      button.dataset.column = j;
      container.appendChild(button);
    }
  }
}

function placeMark(event) {
  const button = event.target;
  let row = button.dataset.row;
  let column = button.dataset.column;
  let mark = newGame.playerTurn(row, column);
  if (mark) {
    button.textContent = mark;
  }

  let result = newGame.isGameOver();
  if (result) {
    setTimeout(() => {
      console.log(result);
      if (result === "tie") {
        confirm("it's a tie");
      } else {
        confirm("the winner is " + result);
      }
    }, 1);

    const container = document.querySelector(".container");
    const cells = container.querySelectorAll("button");
    for (let cell of cells) {
      cell.removeEventListener("click", placeMark);
      cell.classList.remove("active-cell");
    }
  }
}

document.querySelector(".new-game").addEventListener("click", () => {
  document.querySelector("#new-game-form").reset();
  document.querySelector("dialog").showModal();
});

document.querySelector(".rematch").addEventListener("click", () => {});

document
  .querySelector("#new-game-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    newGame = GameController(
      formData.get("player-one"),
      formData.get("player-two"),
    );

    newGame.initializeGame();

    const container = document.querySelector(".container");
    const cells = container.querySelectorAll("button");
    for (let cell of cells) {
      cell.textContent = "";
      cell.addEventListener("click", placeMark);
      cell.classList.add("active-cell");
    }
    const dialog = document.querySelector("#new-game-dialog");
    dialog.close();
  });

function initializeRematch() {
  const rematch = document.querySelector(".rematch");
  rematch.classList.remove("disabled-button");

  rematch.addEventListener("click", resetBoardForRematch);
}

function resetBoardForRematch() {
  newGame.initializeGame();

  const container = document.querySelector(".container");
  const cells = container.querySelectorAll("button");
  for (let cell of cells) {
    cell.textContent = "";
    if (cell.getAttribute("listener") !== "true") {
      cell.addEventListener("click", placeMark);
      cell.classList.add("active-cell");
    }
  }
}

let newGame;

renderBoard();
