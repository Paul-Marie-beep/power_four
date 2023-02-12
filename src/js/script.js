"use strict";

const numberOfLinesOnTheBoard = 6;
const numberOfColumnsOnTheBoard = 7;
// Application Architecture
////////////////////////////////////////////////////////////////////////////////////////////////

// Test Values
const testColumn = 5;
let player;

///////////////////////////////////////////////////////////////////////////

const cellArray = [];
let roundCount = 1;

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
    console.log(cellArray);
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
      .filter(function (cell) {
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
  }

  showInitialBoard() {
    let board = "";
    for (let i = 1; i <= 42; i++) {
      let html = `<div class="board__cell board__cell--${i}"></div>`;
      board = board + html;
    }
    document.querySelector(".board").innerHTML = board;
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

    // 3°) On remplit la case modifiée sur la représentation graphique
    document.querySelector(`.board__cell--${lastUpdatedCellIndex}`).style.backgroundColor = `${colourToFillCellWith}`;
  }
}

new boardCl(numberOfLinesOnTheBoard, numberOfColumnsOnTheBoard);
const testBack = new gameCl();
const testFront = new graphicRepresentationCl(numberOfLinesOnTheBoard, numberOfColumnsOnTheBoard);
testBack.playTurn(testColumn);
testFront.updateBoard();
testBack.playTurn(testColumn);
testFront.updateBoard();
testBack.playTurn(testColumn);
testFront.updateBoard();
