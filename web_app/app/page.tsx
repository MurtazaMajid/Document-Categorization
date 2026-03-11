'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { InputSection } from '@/components/input-section';
import { ResultsGrid } from '@/components/results-grid';
import { HistorySidebar } from '@/components/history-sidebar';
import { useClassification, HistoryItem } from '@/hooks/use-classification';

export default function Home() {
  const { classify, isLoading, error, result, history, clearHistory } =
    useClassification();
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  const handleSubmit = (text: string) => {
    setSelectedHistory(null);
    classify(text);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedHistory(item);
  };

  const displayResult = selectedHistory ? selectedHistory.result : result;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <main className="flex-1">
          <InputSection onSubmit={handleSubmit} isLoading={isLoading} />

          {error && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-6">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Classification Error
                </h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {displayResult && (
            <ResultsGrid result={displayResult} />
          )}

          {!displayResult && !error && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-24 h-24 rounded-full bg-muted/20 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Results Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Enter some text above and click "Classify Text" to get started
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
        <HistorySidebar
          history={history}
          onSelectItem={handleSelectHistory}
          onClear={clearHistory}
        />
      </div>
    </div>
  );
}
