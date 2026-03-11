'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClassificationResult } from '@/hooks/use-classification';

interface ResultsGridProps {
  result: ClassificationResult;
}

export function ResultsGrid({ result }: ResultsGridProps) {
  // Color mapping for different confidence levels
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400';
    if (score >= 0.6) return 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400';
    if (score >= 0.4) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400';
    return 'bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-400';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'Very High Confidence';
    if (score >= 0.6) return 'High Confidence';
    if (score >= 0.4) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Primary Result */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 border-b-2 border-primary pb-3" style={{fontFamily: 'EB Garamond, serif', fontWeight: 700}}>
          CLASSIFICATION RESULT
        </h2>

        <Card className="p-8 border-4 border-primary bg-card shadow-lg" style={{borderStyle: 'double'}}>
          <div className="space-y-6">
            <div>
              <h3 className="text-7xl font-black text-foreground capitalize" style={{fontFamily: 'EB Garamond, serif', lineHeight: 1.1, fontWeight: 800}}>
                {result.primary_category.replace(/_/g, ' ').toUpperCase()}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 tracking-wide">
                {getConfidenceLabel(result.primary_score)}
              </p>
            </div>

            {/* Confidence Display */}
            <div className="bg-secondary/30 p-4 border-l-4 border-primary">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground tracking-wide">CONFIDENCE SCORE</span>
                <span className="text-2xl font-bold text-primary">
                  {(result.primary_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-4 bg-border">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${result.primary_score * 100}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed italic border-t-2 border-muted pt-4">
              This document has been classified as <strong>{result.primary_category.replace(/_/g, ' ')}</strong> with {(result.primary_score * 100).toFixed(1)}% confidence using a fine-tuned BERT transformer model.
            </p>
          </div>
        </Card>
      </div>

      {/* Top Predictions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 border-b-2 border-primary pb-3" style={{fontFamily: 'EB Garamond, serif', fontWeight: 700}}>
          ALTERNATIVE CLASSIFICATIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {result.predictions.map((pred, idx) => (
            <Card
              key={idx}
              className={`p-4 transition-all border-2 ${
                idx === 0 ? 'border-primary bg-card shadow-md' : 'border-muted bg-secondary/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground capitalize leading-tight">
                    {pred.category.replace(/_/g, ' ')}
                  </h3>
                  <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 whitespace-nowrap">
                    #{idx + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-semibold">SCORE</span>
                    <span className="text-sm font-bold text-foreground">
                      {(pred.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-border">
                    <div
                      className={`h-full transition-all ${idx === 0 ? 'bg-primary' : 'bg-accent'}`}
                      style={{ width: `${pred.score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
