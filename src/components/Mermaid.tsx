import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: 'Inter, sans-serif'
});

export const Mermaid = ({ chart }: { chart: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.render(`mermaid-chart-${Math.random().toString(36).substring(2, 9)}`, chart).then(({ svg }) => {
        if (containerRef.current) {
            containerRef.current.innerHTML = svg;
        }
      }).catch(e => console.error("Mermaid parsing error", e));
    }
  }, [chart]);

  return <div ref={containerRef} className="flex justify-center items-center py-4 w-full overflow-x-auto" />;
};
