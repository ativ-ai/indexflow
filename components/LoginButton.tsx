import React from 'react';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { UserProfile } from '../types';
import { getUserProfile } from '../services/authService';
import { GoogleIcon, SpinnerIcon } from './Icons';

interface LoginButtonProps {
    onLoginSuccess: (profile: UserProfile) => void;
    onLoginError: () => void;
    isLoading: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLoginSuccess, onLoginError, isLoading }) => {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
            try {
                const userProfile = await getUserProfile(tokenResponse.access_token);
                await onLoginSuccess(userProfile);
            } catch (err) {
                console.error("Login process failed after getting token:", err);
                onLoginError();
            }
        },
        onError: (error) => {
            console.error('Google Login Hook Error:', error);
            onLoginError();
        },
    });

    return (
        <button
            onClick={() => login()}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 px-4 py-2 bg-white text-slate-700 font-semibold border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 disabled:opacity-75 disabled:cursor-wait"
        >
            {isLoading ? <SpinnerIcon /> : <GoogleIcon />}
            <span>{isLoading ? 'Please wait...' : 'Login with Google'}</span>
        </button>
    );
};

export default LoginButton;
