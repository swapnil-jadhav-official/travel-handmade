'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <style>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        body > * {
          animation: pageEnter 0.3s ease-out;
        }
      `}</style>
      {children}
    </AuthProvider>
  );
}
