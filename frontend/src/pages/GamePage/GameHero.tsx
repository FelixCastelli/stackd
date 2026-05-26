import { useEffect, useState } from "react";
import type { Game } from "./types";

type GameHeroProps = {
  game?: Game;
  bgImage: string | null;
};

export function GameHero({ game, bgImage }: GameHeroProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
  }, [bgImage]);

  return (
    <div id="game-cover-art">
      <div className="game-cover-placeholder" />

      {bgImage && (
        <img
          src={bgImage}
          alt=""
          decoding="async"
          onLoad={() => setIsImageLoaded(true)}
          className={`game-cover-image ${isImageLoaded ? "is-loaded" : ""}`}
        />
      )}

      {game?.name && (
        <div id="game-title">
          <h1 className="mb-0">{game.name}</h1>

          {!!game.involved_companies?.length && (
            <div className="game-title-sub">
              <span className="filler-text">by</span>

              {game.involved_companies.map((involvedCompany, index) => (
                <span key={involvedCompany.id} className="sub-title">
                  {index > 0 && <span className="filler-text">,</span>}

                  {involvedCompany.company.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div id="gradient" />
    </div>
  );
}
