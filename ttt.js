function createPlayer (character) {
  const makeMove = function () {
    let i = prompt("Your move row: ");
    let j = prompt("Your move col: ");
    if (i < 1 || i > 3 || j < 1 || j > 3) {
      return makeMove();
    }
    return [Number(i), Number(j)];
  };

  return {character, makeMove};
};

const xPlayer = createPlayer("X");
const oPlayer = createPlayer("O");

const gameBoard = (function () {
  const board = [["", "", ""], ["", "", ""], ["", "", ""]];

  const playMove = function (player, move) {
    if (board[move[0]-1][move[1]-1] === "") {
      board[move[0]-1][move[1]-1] = player.character;
    } else {
      playMove(player, player.makeMove());
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
    noSpots = false;
    for (row of board) {
      noSpots = row.every(spot => spot !== '');
    }
    return noSpots;
  }

  return {board, playMove, showBoard, checkWin, checkTie};
})();

const displayCards = document.querySelectorAll(".card");

const populateWindow = function () {
  let currentIndex = 0;
  for (card of displayCards) {
    card.textContent = "H";
  }
  // for (row of gameBoard.showBoard()) {
  //   for (spot of row) {
  //     displayCards[currentIndex].textContent = spot;
  //     currentIndex++;
  //   }
  // }
};

const game = function () {
  let currentPlayer = xPlayer;

  const togglePlayer = function () {
    currentPlayer = (currentPlayer === xPlayer) ? oPlayer : xPlayer;
  };

  const playRound = function () {
    gameBoard.showBoard();
    let move = currentPlayer.makeMove();
    gameBoard.playMove(currentPlayer, move);
    populateWindow();
    // console.log(displayCards[move[0] + move[1]])
    // setTimeout(populateWindow, 10);
  };

  const finalMessage = function () {
    gameBoard.showBoard();
    if (gameBoard.checkTie() === true) {
      console.log("This game was a tie!")
    } else {
      togglePlayer();
      console.log("The winner is: ", currentPlayer.character + "!");
    };
  };

  const playGame = function () {
    // populateWindow();
    let endFlag = false;
    while (endFlag === false) {
      playRound();
      endFlag = (gameBoard.checkWin(currentPlayer.character) || gameBoard.checkTie());
      togglePlayer();
    };
    finalMessage();
  };

  return {playGame};
};

// x = game();
// x.playGame();

// me = createPlayer("x");
// gameBoard.playMove(me.character, me.makeMove());
// gameBoard.showBoard();
// console.log(gameBoard.checkWin("x"));
