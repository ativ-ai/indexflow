import React from 'react';
import axios from 'axios';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { UserProfile } from '../types';
import { GoogleIcon } from './Icons';

interface LoginButtonProps {
    onLoginSuccess: (profile: UserProfile) => void;
    onLoginError: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLoginSuccess, onLoginError }) => {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
            try {
                const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json'
                    }
                });
                onLoginSuccess(res.data);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
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
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
        >
            <GoogleIcon />
            <span>Login with Google</span>
        </button>
    );
};

export default LoginButton;