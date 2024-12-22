'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs";

interface TokenContextType {
  tokens: number;
  useToken: () => boolean;
  addTokens: (amount: number) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState(0);
  const { isSignedIn } = useUser();

  useEffect(() => {
    // Load tokens from localStorage
    const savedTokens = localStorage.getItem('tokens');
    if (savedTokens === null) {
      // First time user gets 5 tokens
      setTokens(5);
      localStorage.setItem('tokens', '5');
    } else {
      setTokens(parseInt(savedTokens));
    }
  }, []);

  useEffect(() => {
    // Give 5 extra tokens on first sign in
    if (isSignedIn) {
      const signInBonus = localStorage.getItem('signInBonus');
      if (!signInBonus) {
        addTokens(5);
        localStorage.setItem('signInBonus', 'true');
      }
    }
  }, [isSignedIn]);

  const useToken = () => {
    if (tokens > 0) {
      setTokens(prev => {
        const newTokens = prev - 1;
        localStorage.setItem('tokens', newTokens.toString());
        return newTokens;
      });
      return true;
    }
    return false;
  };

  const addTokens = (amount: number) => {
    setTokens(prev => {
      const newTokens = prev + amount;
      localStorage.setItem('tokens', newTokens.toString());
      return newTokens;
    });
  };

  return (
    <TokenContext.Provider value={{ tokens, useToken, addTokens }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
} 