"use strict";

const numberOfLinesOnTheBoard = 6;
const numberOfColumnsOnTheBoard = 7;
// Application Architecture
////////////////////////////////////////////////////////////////////////////////////////////////

// Test Values
const testColumn = 5;
let player;
let testBack;
let testFront;

///////////////////////////////////////////////////////////////////////////

const cellArray = [];
let roundCount = 1;
let columnChosen;
let pugGraphicallySet = true;
let columnIsAlreadyFilled = false;

///////////////////////////////////////////////////////////////////////////
// DOM
const arrows = document.querySelector(".arrows");

///////////////////////////////////////////////////////////////////////////////////////////
class cellCl {
  constructor(line, column) {
    this.line = line;
    this.column = column;
    this.redInCell = false;
    this.yellowInCell = false;
    this.lastUpdated = false;
  }

  // For the time being, we are going to show the fall of the puck as something purely graphic and assign it directly to the first available cell.
  addYellowPuckInCell() {
    this.redInCell = true;
  }

  addRedPuckInCell() {
    this.yellowInCell = true;
  }
}

class boardCl {
  constructor(lines, columns) {
    this.lines = lines;
    this.columns = columns;
    this.createBoard();
  }

  createBoard() {
    for (let i = 1; i < this.lines + 1; i++) {
      for (let j = 1; j < this.columns + 1; j++) {
        cellArray.push(new cellCl(i, j));
      }
    }
  }
}

class gameCl {
  constructor() {
    this.chosePlayer();
  }

  chosePlayer() {
    if (roundCount % 2 === 0) {
      player = 2;
    } else {
      player = 1;
    }
  }

  updateModel(column) {
    // 1°) Find which cell we have to fill with a pug

    // Since we have reversed the order in the array that contains all the cells that belong to a column, we can use find because the cells in newArray are ordered from top to bottom (ie from the smallest column number to the higher). Hence, we only need the fiste value to get the forst available empty cell in that column

    const chosenCell = cellArray
      .filter((cell) => {
        return cell.column === column;
      })
      .reverse()
      .find((cell) => !cell.redInCell && !cell.yellowInCell);

    // First of all, make sure that nothing happens if the column is already completely filled.
    if (!chosenCell) {
      columnIsAlreadyFilled = true;
      return;
    }

    // 2°) Find the index of the corresponding  cell in the original array
    const index = cellArray.findIndex((cell) => cell.line === chosenCell.line && cell.column === chosenCell.column);

    // 3°) Fill the cell in the original array with the right colour
    if (player === 1) {
      cellArray[index].redInCell = true;
    }
    if (player === 2) {
      cellArray[index].yellowInCell = true;
    }

    // erase the information of the last filled cell
    if (roundCount > 1) {
      cellArray.find((cell) => cell.lastUpdated === true).lastUpdated = false;
    }
    cellArray[index].lastUpdated = true;
    roundCount++;

    // 4°) Change the player
    this.chosePlayer();
  }
}

///////////////////////////////////////////////////////////////////////////
// Graphic Representation

class graphicRepresentationCl {
  constructor(lines, columns) {
    this.lines = lines;
    this.columns = columns;
    this.showInitialBoard();
    this.showArrows();
  }

  showInitialBoard() {
    let board = "";
    for (let i = 1; i <= 42; i++) {
      let html = `<div class="board__cell board__cell--${i}"></div>`;
      board = board + html;
    }
    document.querySelector(".board").innerHTML = board;
  }

  showArrows() {
    const arrowBox = document.querySelectorAll(".arrows__arrow");

    // Dans le HTML, les flèches sont toutes rangées dans le même ordre : rouge puis jaune.
    arrowBox.forEach((box) => {
      if (player === 1) {
        box.firstElementChild.style.display = "inline";
        box.lastElementChild.style.display = "none";
      }
      if (player === 2) {
        box.lastElementChild.style.display = "inline";
        box.firstElementChild.style.display = "none";
      }
    });
  }

  makeCellBlink(lastUpdatedCellIndex, colourToFillCellWith) {
    // Fine out the line on which the pug will stop its descent
    const lineOfLastUpdatedCell = cellArray[lastUpdatedCellIndex].line;

    // Find out the index of the  cell on which the pug will start its descent
    // The '+1' is needed to convert the index from the array in the model to the graphic reprensentation where the first line is designated 1
    let numberOfCellToBlink = lastUpdatedCellIndex + 1 - 7 * (lineOfLastUpdatedCell - 1);

    const startBlinkInterval = function () {
      const blink = function () {
        document.querySelector(`.board__cell--${numberOfCellToBlink}`).style.backgroundColor = colourToFillCellWith;

        // Si on est sur la seconde ligne ou plus bas, on "reblanchit" la ligne précédente. Aucune raison de le faire si on est sur la première ligne évidemment.
        if (numberOfCellToBlink - 7 >= 0) {
          document.querySelector(`.board__cell--${numberOfCellToBlink - 7}`).style.backgroundColor = "#ffffff";
        }
        // On passe à la ligne d'en dessous.
        numberOfCellToBlink = numberOfCellToBlink + 7;

        // On arrête le clignotement quand le palet a atteint sa position finale. (toujours le '+1' pour passer de l'index de l'array du model à numéro de case dans la représentation graphique).
        // Ensuite on montre les flèches de la couleur du nouveau joueur.
        // Puis on indique que le palet est en place et que l'on peut donner une nouvelle instruction.
        if (numberOfCellToBlink > lastUpdatedCellIndex + 1) {
          clearInterval(blinkInterval);
          testFront.showArrows();
          pugGraphicallySet = true;
        }
      };
      const blinkInterval = setInterval(blink, 1);
    };
    startBlinkInterval();
  }

  updateBoard() {
    // 1°) On retrouve l'index de la case à changer
    const lastUpdatedCellIndex = cellArray.findIndex((cell) => cell.lastUpdated === true);

    // 2°) On définit la couleur avec laquelle ont veut remplir la case
    let colourToFillCellWith;
    if (cellArray[lastUpdatedCellIndex].yellowInCell) {
      colourToFillCellWith = "#ffff00";
    }
    if (cellArray[lastUpdatedCellIndex].redInCell) {
      colourToFillCellWith = "#ff0000";
    }

    // On lance la descente du palet
    this.makeCellBlink(lastUpdatedCellIndex, colourToFillCellWith);
  }
}

class ControllerCl {
  constructor() {
    this.insideListener = this.insideListener.bind(this);
    this.columnChosenByPlayer;
    this.initiateGame();
  }

  insideListener(event) {
    // Cette méthode va gérer ce qui va se passer dans l'eventListener, ie quand le joueur appuie sur la flèche.

    // Guard to prevent anything from happening until the puck is set in its final cell
    if (!pugGraphicallySet) return;

    if (event.target.classList.contains("pic")) {
      // We state that the pug is currently descending
      pugGraphicallySet = false;
      // Bien convertir le numéro de colonne en number car la fonction qui en a besoin ensuite veut un number et pas une string
      this.columnChosenByPlayer = +event.target.parentElement.dataset.column;
      testBack.updateModel(this.columnChosenByPlayer);
      if (columnIsAlreadyFilled === false) {
        testFront.updateBoard();
      } else {
        // We set the variables put in the guard functions back to values that enable the next pug to be played
        columnIsAlreadyFilled = false;
        pugGraphicallySet = true;
      }
    }
  }

  initiateGame() {
    new boardCl(numberOfLinesOnTheBoard, numberOfColumnsOnTheBoard);
    testBack = new gameCl();
    testFront = new graphicRepresentationCl(numberOfLinesOnTheBoard, numberOfColumnsOnTheBoard);
    arrows.addEventListener("click", this.insideListener);
  }
}

new ControllerCl();
