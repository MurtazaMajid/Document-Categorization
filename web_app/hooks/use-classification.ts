import { useState, useCallback } from 'react';

export interface Prediction {
  category: string;
  score: number;
}

export interface ClassificationResult {
  primary_category: string;
  primary_score: number;
  predictions: Prediction[];
}

export interface HistoryItem {
  id: string;
  text: string;
  result: ClassificationResult;
  timestamp: Date;
}

export function useClassification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const classify = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Classification failed');
      }

      const data: ClassificationResult = await response.json();
      setResult(data);

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        text,
        result: data,
        timestamp: new Date(),
      };

      setHistory((prev) => [historyItem, ...prev].slice(0, 10)); // Keep last 10
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    classify,
    isLoading,
    error,
    result,
    history,
    clearHistory,
  };
}
