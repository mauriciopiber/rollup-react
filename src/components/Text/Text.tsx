import React from 'react';

export default function Text({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '2.5rem', fontFamily: 'monospace' }}>{children}</div>;
}
