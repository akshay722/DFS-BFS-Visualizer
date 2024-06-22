import React, { useState, useEffect } from "react";
import "./App.css";

const numRows = 20;
const numCols = 20;

const NodeType = {
  EMPTY: "EMPTY",
  START: "START",
  END: "END",
  OBSTACLE: "OBSTACLE",
  PATH: "PATH",
};

const createGrid = () => {
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    const currentRow = [];
    for (let col = 0; col < numCols; col++) {
      currentRow.push(NodeType.EMPTY);
    }
    grid.push(currentRow);
  }
  return grid;
};

const App = () => {
  const [grid, setGrid] = useState(createGrid());
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [message, setMessage] = useState("Please select a start point.");

  useEffect(() => {
    generateMaze();
  }, []);

  const handleNodeClick = (row, col) => {
    const newGrid = grid.slice();
    if (!startNode) {
      newGrid[row][col] = NodeType.START;
      setStartNode({ row, col });
      setMessage("Please select an end point.");
    } else if (!endNode) {
      newGrid[row][col] = NodeType.END;
      setEndNode({ row, col });
      setMessage("Start and end points selected. Now you can visualize.");
    } else {
      newGrid[row][col] =
        newGrid[row][col] === NodeType.OBSTACLE
          ? NodeType.EMPTY
          : NodeType.OBSTACLE;
    }
    setGrid(newGrid);
  };

  const visualizeDFS = () => {
    if (!startNode || !endNode) {
      setMessage("Please ensure both start and end points are selected.");
      return;
    }
    const visitedNodes = dfs(startNode.row, startNode.col);
    animatePath(visitedNodes);
  };

  const visualizeBFS = () => {
    if (!startNode || !endNode) {
      setMessage("Please ensure both start and end points are selected.");
      return;
    }
    const visitedNodes = bfs(startNode.row, startNode.col);
    animatePath(visitedNodes);
  };

  const animatePath = (nodes) => {
    const delay = 50; // Adjust this value to slow down the animation (in milliseconds)

    for (let i = 0; i <= nodes.length; i++) {
      if (i === nodes.length) {
        setTimeout(() => {
          const newGrid = grid.slice();
          nodes.forEach((node) => {
            if (
              newGrid[node.row][node.col] !== NodeType.START &&
              newGrid[node.row][node.col] !== NodeType.END
            ) {
              newGrid[node.row][node.col] = NodeType.PATH;
            }
          });
          setGrid(newGrid);
        }, delay * i);
        return;
      }
      setTimeout(() => {
        const newGrid = grid.slice();
        const node = nodes[i];
        if (
          newGrid[node.row][node.col] !== NodeType.START &&
          newGrid[node.row][node.col] !== NodeType.END
        ) {
          newGrid[node.row][node.col] = NodeType.PATH;
        }
        setGrid(newGrid);
      }, delay * i);
    }
  };

  const dfs = (row, col) => {
    const stack = [{ row, col }];
    const visited = Array(numRows)
      .fill(false)
      .map(() => Array(numCols).fill(false));
    const result = [];

    while (stack.length) {
      const { row, col } = stack.pop();
      if (!isValid(row, col, visited)) continue;
      visited[row][col] = true;
      result.push({ row, col });
      if (grid[row][col] === NodeType.END) return result;
      const neighbors = getNeighbors(row, col);
      for (let neighbor of neighbors) {
        stack.push(neighbor);
      }
    }
    return result;
  };

  const bfs = (row, col) => {
    const queue = [{ row, col }];
    const visited = Array(numRows)
      .fill(false)
      .map(() => Array(numCols).fill(false));
    const result = [];

    while (queue.length) {
      const { row, col } = queue.shift();
      if (!isValid(row, col, visited)) continue;
      visited[row][col] = true;
      result.push({ row, col });
      if (grid[row][col] === NodeType.END) return result;
      const neighbors = getNeighbors(row, col);
      for (let neighbor of neighbors) {
        queue.push(neighbor);
      }
    }
    return result;
  };

  const isValid = (row, col, visited) => {
    return (
      row >= 0 &&
      col >= 0 &&
      row < numRows &&
      col < numCols &&
      !visited[row][col] &&
      grid[row][col] !== NodeType.OBSTACLE
    );
  };

  const getNeighbors = (row, col) => {
    const neighbors = [];
    if (row > 0) neighbors.push({ row: row - 1, col });
    if (row < numRows - 1) neighbors.push({ row: row + 1, col });
    if (col > 0) neighbors.push({ row, col: col - 1 });
    if (col < numCols - 1) neighbors.push({ row, col: col + 1 });
    return neighbors;
  };

  const generateMaze = () => {
    const newGrid = createGrid();
    recursiveDivision(newGrid, 0, numRows - 1, 0, numCols - 1, "horizontal");
    setGrid(newGrid);
    setStartNode(null);
    setEndNode(null);
    setMessage("Please select a start point.");
  };

  const recursiveDivision = (
    grid,
    minRow,
    maxRow,
    minCol,
    maxCol,
    orientation
  ) => {
    if (maxRow < minRow || maxCol < minCol) return;

    if (orientation === "horizontal") {
      const possibleRows = [];
      for (let row = minRow; row <= maxRow; row += 2) {
        possibleRows.push(row);
      }
      const possibleCols = [];
      for (let col = minCol - 1; col <= maxCol + 1; col += 2) {
        possibleCols.push(col);
      }
      const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
      const randomColIndex = Math.floor(Math.random() * possibleCols.length);
      const row = possibleRows[randomRowIndex];
      const col = possibleCols[randomColIndex];

      for (let i = minCol - 1; i <= maxCol + 1; i++) {
        if (i !== col && i >= 0 && i < numCols && row >= 0 && row < numRows) {
          grid[row][i] = NodeType.OBSTACLE;
        }
      }
      recursiveDivision(grid, minRow, row - 2, minCol, maxCol, "vertical");
      recursiveDivision(grid, row + 2, maxRow, minCol, maxCol, "vertical");
    } else {
      const possibleCols = [];
      for (let col = minCol; col <= maxCol; col += 2) {
        possibleCols.push(col);
      }
      const possibleRows = [];
      for (let row = minRow - 1; row <= maxRow + 1; row += 2) {
        possibleRows.push(row);
      }
      const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
      const randomColIndex = Math.floor(Math.random() * possibleCols.length);
      const row = possibleRows[randomRowIndex];
      const col = possibleCols[randomColIndex];

      for (let i = minRow - 1; i <= maxRow + 1; i++) {
        if (i !== row && i >= 0 && i < numRows && col >= 0 && col < numCols) {
          grid[i][col] = NodeType.OBSTACLE;
        }
      }
      recursiveDivision(grid, minRow, maxRow, minCol, col - 2, "horizontal");
      recursiveDivision(grid, minRow, maxRow, col + 2, maxCol, "horizontal");
    }
  };

  return (
    <div className="App">
      <h1>DFS & BFS Visualizer</h1>
      <h2>{message}</h2>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((node, colIndex) => (
              <div
                key={colIndex}
                className={`node ${node.toLowerCase()}`}
                onClick={() => handleNodeClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={visualizeDFS}>Visualize DFS</button>
      <button onClick={visualizeBFS}>Visualize BFS</button>
      <button onClick={generateMaze}>Generate New Maze</button>
    </div>
  );
};

export default App;
