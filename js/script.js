function GameBoard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  function initializeBoard() {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = "";
      }
    }
  }

  return initializeBoard();
}
