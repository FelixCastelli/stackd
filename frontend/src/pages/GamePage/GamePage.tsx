import { useParams } from "react-router-dom";
import { isLoggedIn } from "../../auth";
import { LoadingBar } from "../../components/LoadingBar";
import { Navbar } from "../../components/navbar/Navbar";
import { GameHero } from "./GameHero";
import { GameLoadError } from "./GameLoadError";
import { GameReviewBox } from "./GameReviewBox";
import {
  useDocumentTitle,
  useGame,
  useGameBackground,
  useReviewForm,
} from "./hooks";
import "./GamePage.css";

export function GamePage() {
  const { igdbId } = useParams();
  const { data: game, isPending, isError } = useGame(igdbId);
  const bgImage = useGameBackground(game);
  const { review, setReview, submitReview } = useReviewForm();

  useDocumentTitle(game?.name);

  return (
    <div className="min-h-screen bg-[#16181c] text-white relative pb-20">
      <Navbar overlay />

      <div id="main-gradient" />

      <GameHero game={game} bgImage={bgImage} />

      <LoadingBar loading={isPending} />

      {isError && <GameLoadError />}

      {isLoggedIn() && (
        <GameReviewBox
          review={review}
          onReviewChange={setReview}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
}
