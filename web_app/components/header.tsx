import React from 'react';

export function Header() {
  return (
    <header className="border-b-4 border-primary bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <div className="text-xs tracking-widest text-muted-foreground uppercase mb-3" style={{fontFamily: 'Merriweather, serif', fontWeight: 400, letterSpacing: '0.15em'}}>
            Established 2024
          </div>
          <h1 className="text-7xl sm:text-8xl md:text-9xl text-foreground mb-4 leading-none" style={{fontFamily: 'EB Garamond, serif', fontWeight: 800, letterSpacing: '-0.02em'}}>
            THE DOCUMENT TIMES
          </h1>
          <div className="border-t-2 border-b-2 border-primary py-3 my-5">
            <p className="text-xs text-primary tracking-widest uppercase" style={{fontFamily: 'Merriweather, serif', fontWeight: 700, letterSpacing: '0.12em'}}>
              Machine Learning Classification • Twenty News Groups Dataset
            </p>
          </div>
          <p className="text-sm text-muted-foreground" style={{fontFamily: 'Merriweather, serif', fontWeight: 400}}>
            WASHINGTON, D.C. — THURSDAY, MARCH 7, 2026 — PAGE ONE
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic" style={{fontFamily: 'Merriweather, serif', fontStyle: 'italic'}}>
            Powered by Fine-Tuned BERT Transformer Technology
          </p>
        </div>
      </div>
    </header>
  );
}
