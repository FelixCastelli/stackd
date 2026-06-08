import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ensureGameExists, fetchGameDetails } from "./gameApi";
import type { Game } from "./types";

const MAX_CACHED_GAME_QUERIES = 3;
const cachedGameQueryIds: string[] = [];

export function useGame(igdbId?: string) {
  const queryClient = useQueryClient();
  const gameQuery = useQuery({
    queryKey: ["game", igdbId],
    queryFn: async () => {
      if (!igdbId) {
        throw new Error("Missing game id.");
      }

      const game = await fetchGameDetails(igdbId);
      await ensureGameExists(igdbId);

      return game;
    },
    enabled: !!igdbId,
  });

  useEffect(() => {
    if (!igdbId || !gameQuery.data) {
      return;
    }

    const existingIndex = cachedGameQueryIds.indexOf(igdbId);

    if (existingIndex !== -1) {
      cachedGameQueryIds.splice(existingIndex, 1);
    }

    cachedGameQueryIds.push(igdbId);

    while (cachedGameQueryIds.length > MAX_CACHED_GAME_QUERIES) {
      const removedIgdbId = cachedGameQueryIds.shift();

      if (removedIgdbId) {
        queryClient.removeQueries({
          queryKey: ["game", removedIgdbId],
          exact: true,
        });
      }
    }
  }, [igdbId, gameQuery.data, queryClient]);

  return gameQuery;
}

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
}

export function useGameBackground(game?: Game) {
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    if (!game?.screenshots?.length) {
      setBgImage(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * game.screenshots.length);
    const screenshotUrl = `https:${game.screenshots[randomIndex].url.replace(
      "t_thumb",
      "t_1080p"
    )}`;

    setBgImage(screenshotUrl);
  }, [game]);

  return bgImage;
}

export function useReviewForm() {
  const [review, setReview] = useState("");

  function submitReview() {
    console.log("Review submitted:", review);

    // Review logic

    setReview("");
  }

  return {
    review,
    setReview,
    submitReview,
  };
}
