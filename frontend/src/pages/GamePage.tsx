import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBackend } from "../utils/api";
import { LoadingBar } from "../components/LoadingBar";
import { useEffect, useState } from "react";
import "./GamePage.css";

export function GamePage() {
  const { igdbId } = useParams();
  const [bgImage, setBgImage] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["game", igdbId],
    queryFn: () => fetchBackend(`games/${igdbId}`),
    enabled: !!igdbId,
  });

  useEffect(() => {
    if (data?.name) {
      document.title = data.name;
    }
  }, [data]);

  useEffect(() => {
    if (data?.screenshots?.length) {
      const randomIndex = Math.floor(
        Math.random() * data.screenshots.length
      );

      const screenshotUrl = `https:${data.screenshots[randomIndex].url.replace(
        "t_thumb",
        "t_1080p"
      )}`;

      setBgImage(screenshotUrl);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-[#16181c] text-white relative">
      <nav className="navbar absolute top-0 left-0 right-0">
        <div className="navbar-container">
          <a href="/" className="navbar-brand">
            Backloggr
          </a>
        </div>
      </nav>

      <div id="main-gradient" />

      <div id="game-cover-art" className="row">
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="lazy entered loaded"
          />
        )}

        {data?.name && (
          <div id="game-title">
            <h1 className="mb-0">{data.name}</h1>

            {data?.involved_companies?.length > 0 && (
              <div className="game-title-sub">
                <span className="filler-text">by</span>

                {data.involved_companies.map(
                  (ic: any, index: number) => (
                    <span
                      key={ic.id}
                      className="sub-title"
                    >
                      {index > 0 && (
                        <span className="filler-text">,</span>
                      )}
                      {ic.company.name}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        )}

        <div id="gradient" />
      </div>

      <LoadingBar loading={isPending} />

      {isError && (
        <div className="text-center text-red-500 mt-4">
          Failed to load game.
        </div>
      )}
    </div>
  );
}
