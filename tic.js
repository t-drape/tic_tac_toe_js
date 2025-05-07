function createPlayer(identifier, myName) {
  const character = identifier;
  const name = myName;

  const makeMove = function (target) {
    // This should get input from the user
    return target.id.split(",").map(Number);
  }

  const getCharacter = () => character;
  const getName = () => name;

  // Don't expose character, since it could change outside of function
  return {makeMove, getCharacter, getName};
}

const game = function (name1, name2) {
  const xPlayer = createPlayer("X", name1);
  const oPlayer = createPlayer("O", name2);

  let currentPlayer = xPlayer;

  let gameOver = false;

  const gameBoard = (function () {
    const board = new Array(["", "", ""], ["", "", ""], ["", "", ""]);
  
    const getBoard = () => board;
  
    const getNewBoard = () => board = [["", "", ""], ["", "", ""], ["", "", ""]];
  
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
        console.log(board)
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
  
    return {playMove, showBoard, checkWin, checkTie, getBoard, getNewBoard};
  })();

  const displayController = (function () {
    const displayCards = document.querySelectorAll(".card");
    const endMessage = document.querySelector(".message");

    const makeClickable = function () {
      for (card of displayCards) {
        card.addEventListener("click", playRound);
      }
    }

    const removeListeners = function () {
      for (card of displayCards) {
        card.removeEventListener("click", playRound);
      }
    }

    const populateCards = function () {
      let currentIndex = 0;
      for (row of gameBoard.getBoard()) {
        for (cell of row) {
          displayCards[currentIndex].textContent = cell;
          currentIndex++;
        }
      }
    }

    const resetCards = function () {
      for (card of displayCards) {
        card.textContent = "";
      }
      endMessage.textContent = "";
    }

    const showMessage = function (message) {
      // endMessage.classList.toggle("no-show");
      endMessage.textContent = message;
    }

    const showErrorMessage = function (message) {
      endMessage.textContent = message;
      endMessage.classList.toggle("ani");
    }

    return {populateCards, makeClickable, showMessage, resetCards, showErrorMessage, removeListeners};
  })();

  const showPlayer = () => currentPlayer.getCharacter();

  const togglePlayer = () => currentPlayer = (currentPlayer === xPlayer) ? oPlayer : xPlayer;

  const finalMessage = function (character) {
    if (character) {
      return "THE WINNER IS: " + character + "!";
    } else {
      return "THIS GAME WAS A TIE!";
    }
  } 

  const endGame = function () {
    if (gameBoard.checkWin(currentPlayer.getCharacter())) {
      displayController.showMessage(finalMessage(currentPlayer.getName()));
      displayController.removeListeners();
      return true;
    } else if (gameBoard.checkTie()) {
      displayController.showMessage(finalMessage());
      displayController.removeListeners();
      return true;
    } else {
      return false;
    }
  }

  const playRound = function (event) {
    if (gameOver) return;
    // Call Current player choose move
    let move = currentPlayer.makeMove(event.target);
    // Reflect move in game board array
    if (gameBoard.playMove(currentPlayer.getCharacter(), move)) {
      // moveCol++;
      displayController.populateCards();
      gameOver = endGame();
      togglePlayer();
    }
  }

  const playGame = function () {
    displayController.makeClickable();
  }

  return {gameBoard, displayController, togglePlayer, showPlayer, playGame};
}


let newGame = null

const playNew = function (event) {
  event.preventDefault();
  const data = new FormData(form);
  
  if (newGame) {
    newGame.displayController.resetCards();
    newGame.displayController.removeListeners();
    // newGame.gameBoard.getNewBoard();

  }

  newGame = game(data.get("name1"), data.get("name2"));
  newGame.playGame();
  form.reset();
}

const form = document.querySelector("form");
form.addEventListener("submit", playNew);