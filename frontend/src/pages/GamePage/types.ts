export type GameScreenshot = {
  url: string;
};

export type GameCompany = {
  name: string;
};

export type GameInvolvedCompany = {
  id: number;
  company: GameCompany;
};

export type Game = {
  name?: string;
  screenshots?: GameScreenshot[];
  involved_companies?: GameInvolvedCompany[];
};
