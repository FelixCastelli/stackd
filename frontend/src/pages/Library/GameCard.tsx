import type { LibraryGame } from "./types";

type GameCardProps = {
  game: LibraryGame;
  onOpenGame: (game: LibraryGame) => void;
};

export function GameCard({ game, onOpenGame }: GameCardProps) {
  return (
    <div className="library-game-card-shell">
      <div className="library-game-card">
        {game.cover?.url && (
          <img
            src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
            alt={game.name}
            loading="lazy"
            decoding="async"
            className="library-game-cover"
          />
        )}

        <div className="library-game-overlay">
          <span className="library-game-title">{game.name}</span>
        </div>

        <button
          type="button"
          onClick={() => onOpenGame(game)}
          className="library-game-link"
          aria-label={`Open ${game.name}`}
        />
      </div>
    </div>
  );
}
