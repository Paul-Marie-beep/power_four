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

  playTurn(column) {
    // First of all, erase the information of the last filled cell
    if (roundCount > 1) {
      cellArray.find((cell) => cell.lastUpdated === true).lastUpdated = false;
    }
    // 1°) Find which cell we have to fill with a pug

    // Since we have reversed the order in the array that contains all the cells that belong to a column, we can use find because the cells in newArray are ordered from top to bottom (ie from the smallest column number to the higher). Hence, we only need the fiste value to get the forst available empty cell in that column

    const chosenCell = cellArray
      .filter((cell) => {
        return cell.column === column;
      })
      .reverse()
      .find((cell) => !cell.redInCell && !cell.yellowInCell);

    // 2°) Find the index of the corresponding  cell in the original array
    const index = cellArray.findIndex((cell) => cell.line === chosenCell.line && cell.column === chosenCell.column);

    // 3°) Fill the cell in the original array with the right colour
    if (player === 1) {
      cellArray[index].redInCell = true;
    }
    if (player === 2) {
      cellArray[index].yellowInCell = true;
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
    // The '+1' is needed to convert the index from the array in the model to the graphic reprensentaiton where the first line is designated 1
    let indexOfCellToBlink = lastUpdatedCellIndex + 1 - 7 * (lineOfLastUpdatedCell - 1);

    const startBlinkInterval = function () {
      const blink = function () {
        document.querySelector(`.board__cell--${indexOfCellToBlink}`).style.backgroundColor = colourToFillCellWith;
        if (indexOfCellToBlink - 7 >= 0) {
          document.querySelector(`.board__cell--${indexOfCellToBlink - 7}`).style.backgroundColor = "#ffffff";
        }
        indexOfCellToBlink = indexOfCellToBlink + 7;
        if (indexOfCellToBlink > 42) {
          clearInterval(blinkInterval);
        }
      };
      const blinkInterval = setInterval(blink, 400);
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

class PerformCl {
  constructor() {
    this.insideListener = this.insideListener.bind(this);
    this.columnChosenByPlayer;
    this.initiateGame();
  }

  insideListener(event) {
    // Cette méthode va gérer ce qui va se passer dans l'eventListener, ie quand le joueur appuie sur la flèche.

    if (event.target.classList.contains("pic")) {
      // Bien convertir le numéro de colonne en number car la fonction qui en a besoin ensuite veut un number et pas une string
      this.columnChosenByPlayer = +event.target.parentElement.dataset.column;
      arrows.removeEventListener("click", this.insideListener);
      testBack.playTurn(this.columnChosenByPlayer);
      testFront.updateBoard();
    }
  }

  detectColumnChosen() {
    // On met un event listener sur la boîte avec toutes les flèches
    // const arrows = document.querySelector(".arrows");
    arrows.addEventListener("click", this.insideListener);
  }

  initiateGame() {
    new boardCl(numberOfLinesOnTheBoard, numberOfColumnsOnTheBoard);
    testBack = new gameCl();
    testFront = new graphicRepresentationCl(numberOfLinesOnTheBoard, numberOfColumnsOnTheBoard);
    this.perform();
  }

  perform() {
    this.detectColumnChosen();
  }
}

new PerformCl();
