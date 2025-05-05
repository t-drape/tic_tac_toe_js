function createPlayer (character) {
  const makeMove = function (x, y) {
    let i = x;
    let j = y;
    // if (i < 1 || i > 3 || j < 1 || j > 3) {
    //   return makeMove();
    // }
    return [i, j];
  };

  return {character, makeMove};
};

const xPlayer = createPlayer("X");
const oPlayer = createPlayer("O");

const gameBoard = (function () {
  const board = [["", "", ""], ["", "", ""], ["", "", ""]];

  const playMove = function (player, move) {
    if (board[move[0]][move[1]] === "") {
      board[move[0]][move[1]] = player.character;
    }
    //  else {
    //   playMove(player, player.makeMove());
    // }

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

const displayCards = document.querySelectorAll(".card");

const populateWindow = function (cards) {
  let currentIndex = 0;
  for (row of gameBoard.board) {
    for (spot of row) {
      displayCards[currentIndex].textContent = spot;
      currentIndex++;
    }
  }
};

const game = function () {
  let currentPlayer = xPlayer;

  const togglePlayer = function () {
    currentPlayer = (currentPlayer === xPlayer) ? oPlayer : xPlayer;
  };

  const playRound = function (x, y) {
    populateWindow();
    gameBoard.showBoard();
    const move = currentPlayer.makeMove(x,y);
    gameBoard.playMove(currentPlayer, move);
    // console.log(displayCards[move[0] + move[1]])
    // setTimeout(populateWindow, 10);
  };

  const finalMessage = function () {
    populateWindow();
    gameBoard.showBoard(); 
    if (gameBoard.checkTie() === true) {
      console.log("This game was a tie!")
    } else {
      // togglePlayer();
      console.log("The winner is: ", currentPlayer.character + "!");
    };
  };

  const playGame = function () {
    // populateWindow();
    let endFlag = false;
    let times = 0;
    let x = 1;
    let y = 1;
    while (endFlag === false) {
      playRound(x, y);
      endFlag = (gameBoard.checkWin(currentPlayer.character) || gameBoard.checkTie());
      togglePlayer();
      times++;
      y++;
      if (times == 3) {
        x++;
        y = 1;
      }
      if (times == 6) {
        x++;
        y = 1;
      }
    };
    finalMessage();
  };

  const play = function (event) {
    let id = Number(event.target.id);
    let i = 0;
    let j = 0;
    if (event.target.textContent !== "") {
      alert("Please choose an open square!");
      return false;
    } else {
      if (id > 6) {
        i = 2;
      } else if (id > 3) {
        i = 1;
      }
      j = id - (3*i) - 1;
      gameBoard.playMove(currentPlayer, [i, j]);
      event.target.textContent = currentPlayer.character;
      if (gameBoard.checkWin(currentPlayer.character) || gameBoard.checkTie()) {
        finalMessage();
      };

      togglePlayer();
      return true;
    }
  }
  
  for (card of displayCards) {
    card.addEventListener("click", play);
  }

  return {playGame};
};


// x = game();
// x.playGame();

// me = createPlayer("x");
// gameBoard.playMove(me.character, me.makeMove());
// gameBoard.showBoard();
// console.log(gameBoard.checkWin("x"));
