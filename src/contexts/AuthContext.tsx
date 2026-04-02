"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser, useStackApp } from "@stackframe/stack";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  logout: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stackUser = useUser();
  const stackApp = useStackApp();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const stackUserId = stackUser === undefined ? "loading" : (stackUser?.id ?? "null");

  useEffect(() => {
    if (stackUser === undefined) return;

    if (!stackUser) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const [authJson, profileRes] = await Promise.all([
          stackUser.getAuthJson(),
          fetch("/api/user/profile"),
        ]);
        if (profileRes.ok) {
          const { user: prismaUser } = await profileRes.json();
          setUser(prismaUser);
        }
        setToken(authJson.accessToken ?? null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [stackUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = async () => {
    await stackApp.signOut();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
