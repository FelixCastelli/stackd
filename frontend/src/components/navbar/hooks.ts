import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { fetchBackend } from "../../utils/api";
import type { NavbarSearchGame } from "./types";

function useDebouncedValue(value: string, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export function useNavbarSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NavbarSearchGame[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const abortController = new AbortController();

    async function searchGames() {
      setIsSearching(true);

      try {
        const data = (await fetchBackend(
          `games/search?query=${encodeURIComponent(debouncedQuery)}`,
          { signal: abortController.signal }
        )) as NavbarSearchGame[];

        setResults(data);
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Failed to search games", err);
          setResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    }

    searchGames();

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery]);

  function openGame(game: NavbarSearchGame) {
    const slug = slugify(game.name, {
      lower: true,
      strict: true,
      remove: /['’]/g,
    });

    setQuery("");

    navigate(`/games/lib/${slug}/${game.id}`, {
      state: { igdbId: game.id },
    });
  }

  return {
    query,
    setQuery,
    results,
    isSearching,
    showResults: debouncedQuery.length >= 2,
    openGame,
  };
}
