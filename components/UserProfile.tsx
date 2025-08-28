import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';

interface UserProfileDisplayProps {
    user: UserProfile;
    onLogout: () => void;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 text-left rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <img
                    className="h-9 w-9 rounded-full object-cover"
                    src={user.picture}
                    alt="User avatar"
                />
                <div className="hidden sm:flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                </div>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    <div className="py-1" role="none">
                        <button
                            onClick={onLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            role="menuitem"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileDisplay;