import { createContext, useContext, useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// GraphQL mutation for token refresh
const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const { data } = await refreshTokenMutation({
                variables: { refreshToken },
            });

            if (data?.refreshToken) {
                const { accessToken, refreshToken: newRefreshToken } = data.refreshToken;
                localStorage.setItem('auth_token', accessToken);
                localStorage.setItem('refresh_token', newRefreshToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout(); // Logout if refresh fails
        }
    };


    // Check for existing tokens on mount
    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage?.getItem('auth_token');
            const refreshToken = localStorage?.getItem('refresh_token');

            if (accessToken && refreshToken) {
                setIsAuthenticated(true);
                // Set up token refresh interval
                const refreshInterval = setInterval(refreshAccessToken, 14 * 60 * 1000); // Refresh every 14 minutes
                return () => clearInterval(refreshInterval);
            }
            setIsAuthenticated(false);
        };

        checkAuth();
        setIsLoading(false);
    }, []);

    const login = (accessToken: string, refreshToken: string) => {
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        navigate('/auth');
    };


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                login,
                logout,
                refreshAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 