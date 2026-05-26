import { LoadingBar } from "../../components/LoadingBar";
import { Navbar } from "../../components/navbar/Navbar";
import { GameGrid } from "./GameGrid";
import { LibraryLoadError } from "./LibraryLoadError";
import { useDocumentTitle, useFetchGames, useOpenGamePage } from "./hooks";
import "./Library.css";

export function Library() {
  const { data: games, isPending, isError } = useFetchGames();
  const openGamePage = useOpenGamePage();

  useDocumentTitle("Games | Backloggr");

  return (
    <div className="library-page">
      <Navbar />

      <main className="library-content">
        <LoadingBar loading={isPending} />

        {isError && <LibraryLoadError />}

        {!isPending && games && (
          <GameGrid games={games} onOpenGame={openGamePage} />
        )}
      </main>
    </div>
  );
}
