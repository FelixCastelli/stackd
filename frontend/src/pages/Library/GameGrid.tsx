import { GameCard } from "./GameCard";
import type { LibraryGame } from "./types";

type GameGridProps = {
  games: LibraryGame[];
  onOpenGame: (game: LibraryGame) => void;
};

export function GameGrid({ games, onOpenGame }: GameGridProps) {
  return (
    <div className="library-grid-shell">
      <div className="library-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onOpenGame={onOpenGame} />
        ))}
      </div>
    </div>
  );
}
