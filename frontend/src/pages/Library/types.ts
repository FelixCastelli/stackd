export type LibraryGameCover = {
  url?: string;
};

export type LibraryGame = {
  id: number;
  name: string;
  cover?: LibraryGameCover;
};
