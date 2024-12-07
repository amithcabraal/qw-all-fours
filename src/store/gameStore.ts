import { create } from 'zustand';
import { GameState, Grid, Player, Position } from '../types/game';

const GRID_SIZE = 4;

const createEmptyGrid = (): Grid => {
  return Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null)
    )
  );
};

const checkWinner = (grid: Grid, pos: Position): [Player | null, Position[]] => {
  const [x, y, z] = pos;
  const player = grid[x][y][z];
  if (!player) return [null, []];

  const directions = [
    [[1,0,0], [-1,0,0]], // x-axis
    [[0,1,0], [0,-1,0]], // y-axis
    [[0,0,1], [0,0,-1]], // z-axis
    [[1,1,0], [-1,-1,0]], // xy diagonal
    [[1,0,1], [-1,0,-1]], // xz diagonal
    [[0,1,1], [0,-1,-1]], // yz diagonal
    [[1,1,1], [-1,-1,-1]], // xyz diagonal
  ];

  for (const dirPair of directions) {
    const positions: Position[] = [pos];
    let count = 1;

    for (const [dx, dy, dz] of dirPair) {
      let cx = x + dx;
      let cy = y + dy;
      let cz = z + dz;

      while (
        cx >= 0 && cx < GRID_SIZE &&
        cy >= 0 && cy < GRID_SIZE &&
        cz >= 0 && cz < GRID_SIZE &&
        grid[cx][cy][cz] === player
      ) {
        positions.push([cx, cy, cz]);
        count++;
        cx += dx;
        cy += dy;
        cz += dz;
      }
    }

    if (count >= 4) {
      return [player, positions];
    }
  }

  return [null, []];
};

export const useGameStore = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  currentPlayer: 1,
  winner: null,
  winningPositions: [],

  placeToken: (x: number, z: number) => {
    if (get().winner) return;

    const grid = [...get().grid];
    let y = 0; // Start from bottom

    // Find the first empty spot from bottom up
    while (y < GRID_SIZE && grid[x][z][y] !== null) {
      y++;
    }

    if (y >= GRID_SIZE) return; // Column is full

    grid[x][z][y] = get().currentPlayer;
    const [winner, winningPositions] = checkWinner(grid, [x, z, y]);

    set({
      grid,
      currentPlayer: get().currentPlayer === 1 ? 2 : 1,
      winner,
      winningPositions
    });
  },

  resetGame: () => {
    set({
      grid: createEmptyGrid(),
      currentPlayer: 1,
      winner: null,
      winningPositions: []
    });
  }
}));