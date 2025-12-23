import type { CAPICrossword } from '@/types/crossword';
import { getStoredIdToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Backend API response types
interface PuzzleApiResponse {
  id: string;
  puzzle_number: number;
  name: string;
  data: CAPICrossword;
  progress: Record<string, string> | null;
}

export interface PuzzleProgress {
  puzzle_id: string;
  puzzle_name: string;
  cells: Record<string, string>;
  is_completed: boolean;
  started_at: string;
  completed_at: string | null;
  completion_percentage: number;
}

export interface ProgressHistoryItem {
  puzzle_id: string;
  puzzle_number: number;
  puzzle_name: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  completion_percentage: number;
}

class ApiClient {
  private get headers(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = getStoredIdToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getNextPuzzle(): Promise<CAPICrossword & { progress?: Record<string, string> }> {
    const res = await fetch(`${API_URL}/puzzles/next`, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error('Failed to fetch next puzzle');
    }
    const response: PuzzleApiResponse = await res.json();
    // Extract CAPICrossword data and merge with backend ID
    return {
      ...response.data,
      id: response.id,
      progress: response.progress ?? undefined,
    };
  }

  async getPuzzle(id: string): Promise<CAPICrossword & { progress?: Record<string, string> }> {
    const res = await fetch(`${API_URL}/puzzles/${id}`, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error('Failed to fetch puzzle');
    }
    const response: PuzzleApiResponse = await res.json();
    // Extract CAPICrossword data and merge with backend ID
    return {
      ...response.data,
      id: response.id,
      progress: response.progress ?? undefined,
    };
  }

  async getProgress(): Promise<ProgressHistoryItem[]> {
    const res = await fetch(`${API_URL}/progress`, {
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error('Failed to fetch progress');
    }
    return res.json();
  }

  async updateProgress(puzzleId: string, cells: Record<string, string>): Promise<void> {
    const res = await fetch(`${API_URL}/progress/${puzzleId}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({ cells }),
    });
    if (!res.ok) {
      throw new Error('Failed to update progress');
    }
  }

  async completePuzzle(puzzleId: string): Promise<void> {
    const res = await fetch(`${API_URL}/progress/${puzzleId}/complete`, {
      method: 'POST',
      headers: this.headers,
    });
    if (!res.ok) {
      throw new Error('Failed to mark puzzle as complete');
    }
  }
}

export const apiClient = new ApiClient();
