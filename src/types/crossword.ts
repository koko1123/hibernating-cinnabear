export type CAPIEntry = {
  id: string;
  number: number;
  humanNumber: string;
  clue: string;
  direction: 'across' | 'down';
  length: number;
  position: { x: number; y: number };
  separatorLocations: Record<string, number[]>;
  solution?: string;
  group: string[];
};

export type CAPICrossword = {
  id: string;
  number: number;
  name: string;
  creator?: { name: string; webUrl: string };
  date: number;
  webPublicationDate?: number;
  dimensions: { cols: number; rows: number };
  crosswordType:
    | 'cryptic'
    | 'everyman'
    | 'prize'
    | 'quick-cryptic'
    | 'quick'
    | 'quiptic'
    | 'special'
    | 'speedy'
    | 'sunday-quick'
    | 'weekend'
    | 'mini';
  entries: CAPIEntry[];
  solutionAvailable: boolean;
  dateSolutionAvailable?: number;
  pdf?: string;
  instructions?: string;
};

export type Progress = string[][];
