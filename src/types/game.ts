export type Player = 1 | 2;
export type Cell = Player | null;
export type Grid = Cell[][][];
export type Position = [number, number, number];

export interface GameState {
  grid: Grid;
  currentPlayer: Player;
  winner: Player | null;
  winningPositions: Position[];
  placeToken: (x: number, y: number) => void;
  resetGame: () => void;
}