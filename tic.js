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
  const xPlayer = createPlayer("X");
  const oPlayer = createPlayer("O");

  let currentPlayer = xPlayer;

  let moveRow = 0;
  let moveCol = 0;

  const gameBoard = (function () {
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];
  
    const playMove = function (player, move) {
      if (board[move[0]][move[1]] === "") {
        board[move[0]][move[1]] = player;
        return true;
      } else {
        return false;
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

  const displayController = (function () {
    const displayCards = document.querySelectorAll(".card");

    const populateCards = function () {
      let currentIndex = 0;
      for (row of gameBoard.board) {
        for (cell of row) {
          displayCards[currentIndex].textContent = cell;
          currentIndex++;
        }
      }
    }

    return {populateCards};
  })();

  const showPlayer = () => currentPlayer.getCharacter();

  const togglePlayer = () => currentPlayer = (currentPlayer === xPlayer) ? oPlayer : xPlayer;

  const finalMessage = function (character) {
    if (character) {
      console.log("THE WINNER IS: " + character + "!");
    } else {
      console.log("THIS GAME WAS A TIE!");
    }
  } 

  const endGame = function () {
    if (gameBoard.checkWin(currentPlayer.getCharacter())) {
      finalMessage(currentPlayer.getCharacter());
      return true;
    } else if (gameBoard.checkTie()) {
      finalMessage();
      return true;
    } else {
      return false;
    }
  }

  const playRound = function () {
    // Call Current player choose move
    let move = currentPlayer.makeMove(moveRow, moveCol);
    // Reflect move in game board array
    if (gameBoard.playMove(currentPlayer.getCharacter(), move)) {
      moveCol++;
      displayController.populateCards();
      return endGame();
    } else {
      console.log("Please enter valid move!");
      playRound();
    }
    // Check if move ended game
    // Remove this
  }

  const playGame = function () {
    while (playRound() === false) {
      if (moveCol == 3 || moveCol == 6) {
        moveRow++;
        moveCol = 0;
      }
      if (moveRow == 3) {
        moveRow = 0;
      }
      // Switch to other player
      togglePlayer();
    }
  }

  return {gameBoard, togglePlayer, showPlayer, playGame};
}