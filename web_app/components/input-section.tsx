'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export function InputSection({ onSubmit, isLoading }: InputSectionProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleExample = () => {
    setText(
      "NASA announced a new mission to the Moon. The Artemis program will send astronauts back to lunar orbit for the first time in decades, paving the way for sustainable exploration of the Moon and eventual missions to Mars."
    );
  };

  return (
    <section className="bg-background border-b-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-black text-foreground mb-4 text-balance" style={{fontFamily: 'EB Garamond, serif', fontWeight: 700}}>
            SUBMIT A DOCUMENT FOR CLASSIFICATION
          </h2>
          <p className="text-base text-foreground mb-8 leading-relaxed" style={{fontFamily: 'Merriweather, serif'}}>
            Paste any news article, document, or text passage below. Our fine-tuned BERT transformer will automatically categorize it into one of 7 news categories with confidence scoring.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative border-2 border-primary bg-card p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here... (minimum 10 characters)"
                rows={6}
                className="w-full px-0 py-0 bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none text-base leading-relaxed"
                style={{fontFamily: 'Merriweather, serif'}}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isLoading || !text.trim()}
                size="lg"
                className="sm:w-auto font-bold tracking-wide"
                style={{backgroundColor: '#2c2c2c', color: '#f4ede4'}}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    CLASSIFY TEXT
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleExample}
                disabled={isLoading}
                className="font-bold tracking-wide"
              >
                LOAD EXAMPLE
              </Button>
            </div>

            <p className="text-xs text-muted-foreground tracking-wide">
              Enter at least 10 characters • Uses fine-tuned BERT transformer • Confidence scoring applied
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
