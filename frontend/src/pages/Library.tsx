import { fetchBackend } from "../utils/api";
import { useQuery } from "@tanstack/react-query";
import { LoadingBar } from "../components/LoadingBar";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";

export function Library() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["games"],
    queryFn: () => fetchBackend("games"),
  });

  // console.log("LIBRARY DATA:", data); check if anything is returned (for when the steam service is down)

  const navigate = useNavigate();

  const ensureGameExists = async (igdbId: number, name: string) => {
    try {
      await fetchBackend("games", {
        method: "POST",
        body: JSON.stringify({ 
          igdb_id: igdbId, 
          name: name 
        }),
      });
    } catch (err) {
      console.error("Failed to ensure game exists:", err);
    }
  };

  const makeSlug = (name: string) => 
    slugify(name, {
      lower: true,
      strict: true,
      remove: /['’]/g,
    }
    )

  const goToGamePage = async (game: any) => {
    try {
      await ensureGameExists(game.id, game.name);

      const slug = makeSlug(game.name);

      navigate(`/games/lib/${slug}/${game.id}`, {
        state: { igdbId: game.id },
      });
    } catch (err) {
      console.error("Failed to open the game page", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#16181c] text-white p-4 md:p-6 font-['Roboto']">
      <LoadingBar loading={isPending} />

      <h1 className="text-2xl font-semibold mb-6 text-center text-white">
        Trending Games
      </h1>

      {isError && (
        <div className="text-center text-red-500">Failed to load games.</div>
      )}

      {!isPending && data && (
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-start max-w-[1170px] -mx-[0.5rem]">
            {data.map((game: any) => (
              <div
                key={game.id}
                className="
                  px-[0.5rem]
                  mb-[1rem]
                  w-[20%]
                  md:w-[16.6667%]
                  flex
                  justify-center
                "
              >
                <div
                  className="
                    relative
                    w-full
                    aspect-[0.75/1]
                    overflow-hidden
                    rounded-[4px]
                    border
                    border-[#3b414e]
                    bg-[#272c37]
                    group
                    hover:border-[#3f4b64]
                    transition-colors
                    duration-200
                  "
                >
                  {game.cover?.url && (
                    <img
                      src={`https:${game.cover.url.replace(
                        "t_thumb",
                        "t_cover_big"
                      )}`}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium text-center px-2">
                      {game.name}
                    </span>
                  </div>

                  <div
                    onClick={() => goToGamePage(game)}
                    className="absolute inset-0 z-[5] cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
