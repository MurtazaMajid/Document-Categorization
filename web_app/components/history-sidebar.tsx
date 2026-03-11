'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/hooks/use-classification';
import { Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClear: () => void;
}

export function HistorySidebar({
  history,
  onSelectItem,
  onClear,
}: HistorySidebarProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside className="sticky top-0 h-screen w-80 border-l-4 border-primary bg-card p-6 overflow-y-auto hidden lg:block">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b-2 border-primary">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest" style={{fontFamily: 'Merriweather, serif'}}>
            RECENT HISTORY
          </h3>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 w-7 p-0 hover:bg-primary/20"
              title="Clear history"
            >
              <Trash2 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-4 bg-secondary/20 border-2 border-muted">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Classified documents will appear here (last 10 stored in session)
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="w-full text-left p-3 border-2 border-border hover:border-primary hover:bg-secondary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    {item.result.primary_category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-foreground line-clamp-2 group-hover:text-primary leading-snug">
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-border">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${item.result.primary_score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {(item.result.primary_score * 100).toFixed(0)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t-2 border-primary text-xs text-muted-foreground space-y-3">
          <p className="font-bold uppercase tracking-wide" style={{color: '#2c2c2c', fontFamily: 'Merriweather, serif'}}>
            20 Categories
          </p>
          <div className="space-y-1 text-xs leading-relaxed">
            <p>Atheism • Religion</p>
            <p>Crypto • Electronics</p>
            <p>Graphics • Motorcycles</p>
            <p>Autos • Baseball</p>
            <p>Hockey • Guns • Medicine</p>
            <p>Forsale • Space</p>
            <p>Windows • Politics</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
