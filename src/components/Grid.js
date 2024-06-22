import React from "react";
import styled from "styled-components";
import Cell from "./Cell";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.size}, 20px);
  grid-gap: 1px;
`;

const Grid = ({ size, grid, path, start, end, setGrid }) => {
  return (
    <GridContainer size={size}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            cell={cell}
            path={path}
            grid={grid}
            setGrid={setGrid}
            start={start}
            end={end}
          />
        ))
      )}
    </GridContainer>
  );
};

export default Grid;
