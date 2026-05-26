import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { fetchBackend } from "../../utils/api";
import type { LibraryGame } from "./types";

export function useFetchGames() {
  return useQuery({
    queryKey: ["games"],

    queryFn: async () => {
      const games = await fetchBackend("games");

      return games as LibraryGame[];
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function useOpenGamePage() {
  const navigate = useNavigate();

  const openGamePage = useCallback(
    (game: LibraryGame) => {
      const slug = makeGameSlug(game.name);

      const gameUrl = `/games/lib/${slug}/${game.id}`;

      navigate(gameUrl, {
        state: {
          igdbId: game.id,
        },
      });
    },
    [navigate]
  );

  return openGamePage;
}

function makeGameSlug(name: string) {
  return slugify(name, {
    lower: true,
    strict: true,
    remove: /['’]/g,
  });
}
