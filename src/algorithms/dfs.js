// src/algorithms/dfs.js
export const dfs = (grid, start, end) => {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const stack = [start];
  const visited = new Set();
  const parent = new Map();
  parent.set(start.toString(), null);

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    if (x === end[0] && y === end[1]) {
      const path = [];
      let current = end;
      while (current) {
        path.push(current);
        current = parent.get(current.toString());
      }
      return path.reverse();
    }

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      const newPos = [newX, newY];
      if (
        newX >= 0 &&
        newX < grid.length &&
        newY >= 0 &&
        newY < grid[0].length &&
        grid[newX][newY] !== "obstacle" &&
        !visited.has(newPos.toString())
      ) {
        visited.add(newPos.toString());
        stack.push(newPos);
        parent.set(newPos.toString(), [x, y]);
      }
    }
  }

  return [];
};
