"use strict";

const numberOfLinesOnTheBoard = 6;
const numberOfColumnsOnTheBoard = 7;
// Application Architecture
////////////////////////////////////////////////////////////////////////////////////////////////

const cellArray = [];

///////////////////////////////////////////////////////////////////////////////////////////
class cellCl {
  constructor(line, column) {
    this.line = line;
    this.column = column;
    this.redInCell = false;
    this.yellowInCell = false;
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

new boardCl(numberOfLinesOnTheBoard, numberOfColumnsOnTheBoard);
