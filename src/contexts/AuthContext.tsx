import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserAddress } from '../types';
import { apiService } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithProvider: (provider: 'google' | 'facebook') => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>; // For user's own profile
  adminUpdateUser: (user: User) => Promise<void>; // For admin to update any user
  deleteUser: (userId: number) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'loyaltyPoints' | 'createdAt'>) => Promise<void>;
  fetchUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // A '/me' endpoint is best practice to verify token and get user data
          const currentUser = await apiService.fetchCurrentUser(); 
          setUser(currentUser);
        } catch (error) {
          console.error("Session invalid, logging out.", error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };
    checkLoggedIn();
  }, []);


  const login = async (email: string, password: string): Promise<User> => {
     const { user: apiUser, token } = await apiService.login(email, password);
     localStorage.setItem('authToken', token);
     setUser(apiUser);
     return apiUser;
  };
  
  const register = async (name: string, email: string, password: string): Promise<void> => {
     const { user: apiUser, token } = await apiService.register(name, email, password);
     localStorage.setItem('authToken', token);
     setUser(apiUser);
  };

  const loginWithProvider = async (provider: 'google' | 'facebook'): Promise<User> => {
     // In a real app, this would redirect to the backend's OAuth endpoint, e.g., /api/auth/google
     // The backend handles the OAuth flow, creates/finds the user, generates a JWT,
     // and then redirects back to the frontend with the token.
     console.warn(`Initiating login with ${provider}... This is a placeholder for backend OAuth flow.`);
     throw new Error("Social login is not connected to a backend implementation.");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const fetchUsers = async () => {
      const allUsers = await apiService.fetchUsers(); // Assuming a /api/users endpoint exists
      setUsers(allUsers);
  };
  
  const updateUser = async (updatedUser: User) => {
    const savedUser = await apiService.updateUser(updatedUser);
    setUser(savedUser); // Update the currently logged-in user's state
    // If an admin is updating another user, the users list will need refreshing
    setUsers(prev => prev.map(u => u.id === savedUser.id ? savedUser : u));
  };

  const adminUpdateUser = async (updatedUser: User) => {
    const savedUser = await apiService.updateUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === savedUser.id ? savedUser : u));
    if (user?.id === savedUser.id) {
        setUser(savedUser);
    }
  };

  const addUser = async (newUser: Omit<User, 'id' | 'loyaltyPoints' | 'createdAt'>) => {
    // FIX: The apiService expects loyaltyPoints and createdAt. We'll add default
    // values here before creating the user. The backend may override createdAt.
    const fullUserPayload: Omit<User, 'id'> = {
        ...newUser,
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
    };
     const createdUser = await apiService.addUser(fullUserPayload);
     setUsers(prev => [...prev, createdUser]);
  };
  
  const deleteUser = async (userId: number) => {
    await apiService.deleteUser(userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (user?.id === userId) {
        logout();
    }
  };


  return (
    <AuthContext.Provider value={{ user, users, isLoading, login, register, loginWithProvider, logout, updateUser, adminUpdateUser, deleteUser, addUser, fetchUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};