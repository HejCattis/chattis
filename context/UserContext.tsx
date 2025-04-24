import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  displayName: string;
  setDisplayName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayName] = useState<string>('');

  return (
    <UserContext.Provider value={{ displayName, setDisplayName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 