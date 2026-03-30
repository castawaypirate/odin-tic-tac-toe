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
    if (!(mark === "X" || mark === "O")) {
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
  const firstPlayer = Player(firstPlayerName, "X");
  const secondPlayer = Player(secondPlayerName, "O");

  function play() {
    game.initializeBoard();
    let playing = firstPlayer;
    let waiting = secondPlayer;
    let turns = 0;
    do {
      let message = playerTurn(playing);
      while (message) {
        alert(message);
        message = playerTurn(playing);
      }
      [playing, waiting] = [waiting, playing];
      turns++;
      game.printBoard();
    } while (!game.gameOver() && turns < 9);

    if (turns === 9 && !game.gameOver()) {
      console.log("tie");
    } else {
      console.log("winner: " + waiting.getPlayerName());
      console.log("loser: " + playing.getPlayerName());
    }
  }

  function playerTurn(player) {
    var row = prompt("row for " + player.getPlayerMark() + ": ");
    var column = prompt("column for " + player.getPlayerMark() + ": ");
    return game.placingMark(row, column, player.getPlayerMark());
  }

  return { play };
}

const newGame = GameController("one", "two");
// newGame.play();
