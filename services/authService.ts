import axios from 'axios';
import { UserProfile } from '../types';

export const getUserProfile = async (accessToken: string): Promise<UserProfile> => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                }
            }
        );

        if (response.data && response.data.id && response.data.email) {
            return response.data as UserProfile;
        } else {
            throw new Error('Invalid user profile data received from Google.');
        }
    } catch (error) {
        console.error("Failed to fetch user profile from Google:", error);
        if (axios.isAxiosError(error) && error.response) {
            console.error("Google API Error:", error.response.data);
        }
        throw new Error('Could not fetch user profile.');
    }
};
