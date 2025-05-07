function createPlayer(identifier) {
  const character = identifier;

  const makeMove = function (x, y) {
    // This should get input from the user
    return [x, y];
  }

  const getCharacter = () => character;

  // Don't expose character, since it could change outside of function
  return {makeMove, getCharacter}
}


const game = function () {
  const xPlayer = createPlayer("x");
  const oPlayer = createPlayer("o");

  let currentPlayer = xPlayer;

  const gameBoard = (function () {
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];
  
    const playMove = function (player, move) {
      if (board[move[0]][move[1]] === "") {
        board[move[0]][move[1]] = player;
      }
    };
  
    const showBoard = function () {
      for (row of board) {
        console.log(row);
      };
    };
  
    const transposeBoard = function () {
      return board[0].map((_, colIndex) => 
      board.map(row => row[colIndex]));
    };
  
    const checkWin = function (player) {
      // All rows
      for (row of board) {
        if (row.every(value => value === player) === true) {
          return true;
        }
      }
      // All Diagonals
      console.log(transposeBoard())
      for (row of transposeBoard()) {
        if (row.every(value => value === player) === true) {
          return true;
        }
      }
      // Diagonal
      if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
      };
      // Anti-Diagonal
      if (board[2][0] === player && board[1][1] === player && board[0][2] === player) {
        return true;
      };
      return false;
    }
    
    const checkTie = function () {
      for (row of board) {
        for (col of row) {
          if (col === "") {
            return false
          }
        }
      }
      return true;
    }
  
    return {board, playMove, showBoard, checkWin, checkTie};
  })();

  const showPlayer = () => currentPlayer.getCharacter();

  const togglePlayer = () => currentPlayer = (currentPlayer === xPlayer) ? oPlayer : xPlayer;

  return {gameBoard, togglePlayer, showPlayer};
}

const displayController = (function () {

})();