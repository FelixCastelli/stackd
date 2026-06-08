import { fetchBackend } from "../../utils/api";
import type { Game } from "./types";

export async function fetchGameDetails(igdbId: string): Promise<Game> {
  return (await fetchBackend(`games/${igdbId}`)) as Game;
}

export async function ensureGameExists(igdbId: string): Promise<void> {
  await fetchBackend(`games/${igdbId}`, {
    method: "PUT",
  });
}
