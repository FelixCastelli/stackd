import { fetchBackend } from "./utils/api";
import { useQuery } from '@tanstack/react-query'

export default function App() {
  const { data, isPending, isError } = useQuery({ 
    queryKey: ['games'], 
    queryFn: () => fetchBackend('games') })

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      {isPending && (
        <div className="fixed top-0 left-0 w-full h-[3px] z-50 overflow-hidden">
          <div className="h-full bg-white animate-loading-bar"></div>
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-6 text-center">Trending Games</h1>

      {isError && (
        <div className="text-center text-red-500">Failed to load games.</div>
      )}

      {!isPending && data && (
        <div className="max-w-[1088px] mx-auto flex flex-wrap gap-4 justify-center">
          {data.map((game: any) => (
            <div
              key={game.id}
              className="relative w-[168px] h-[227px] overflow-hidden rounded-sm group cursor-pointer border border-white/30 transition-colors duration-200"
            >
              {game.cover?.url && (
                <img
                  src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium text-center px-2">
                  {game.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
