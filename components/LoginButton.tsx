import React from 'react';
import axios from 'axios';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { UserProfile } from '../types';
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
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json'
                    }
                });
                if (res.data && res.data.id && res.data.email) {
                    // Awaiting the onLoginSuccess handler ensures that any async errors
                    // within it (like failing to fetch audit history) are caught here.
                    await onLoginSuccess(res.data);
                } else {
                    // Throw an error to be caught by the catch block below
                    throw new Error('Invalid user profile data received from Google.');
                }
            } catch (err) {
                console.error("Failed to fetch user profile or process login:", err);
                onLoginError();
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
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