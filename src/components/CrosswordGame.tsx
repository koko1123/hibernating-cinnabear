'use client';

import { Crossword, type CrosswordProps } from '@guardian/react-crossword';
import type { CAPICrossword } from '@/types/crossword';

interface CrosswordGameProps {
  puzzle: CAPICrossword;
}

export default function CrosswordGame({ puzzle }: CrosswordGameProps) {
  return (
    <div className="crossword-container w-full flex flex-col items-center">
      <Crossword
        data={puzzle as unknown as CrosswordProps['data']}
        gridBackgroundColor="#000000"
        gridForegroundColor="#fce7f3"
        gridTextColor="#333333"
        textColor="#333333"
        focusColor="#ec4899"
        selectedBackgroundColor="#f472b6"
        connectedBackgroundColor="#fbcfe8"
      />
    </div>
  );
}
