import React from "react";
import styled from "styled-components";

const CellContainer = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ cell, path, row, col }) => {
    if (cell === "start") return "green";
    if (cell === "end") return "red";
    if (cell === "obstacle") return "black";
    if (path.some(([x, y]) => x === row && y === col)) return "blue";
    return "white";
  }};
  border: 1px solid #ccc;
`;

const Cell = ({ row, col, cell, path = [], grid, setGrid, start, end }) => {
  const handleClick = () => {
    if (
      (row === start[0] && col === start[1]) ||
      (row === end[0] && col === end[1])
    ) {
      return;
    }
    const newGrid = grid.map((r, rowIndex) =>
      r.map((c, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return c === "empty" ? "obstacle" : "empty";
        }
        return c;
      })
    );
    setGrid(newGrid);
  };

  return (
    <CellContainer
      cell={cell}
      path={path}
      row={row}
      col={col}
      onClick={handleClick}
    />
  );
};

export default Cell;
