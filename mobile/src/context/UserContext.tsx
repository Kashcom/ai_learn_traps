import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type UserStats = {
    xp: number;
    level: number;
    name: string;
};

type UserContextType = {
    userId: string;
    stats: UserStats;
    refreshStats: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string>("");
    const [stats, setStats] = useState<UserStats>({ xp: 0, level: 1, name: "Student" });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            let storedId = await AsyncStorage.getItem("user_id");
            if (!storedId) {
                storedId = uuidv4();
                await AsyncStorage.setItem("user_id", storedId!);
            }
            setUserId(storedId!);
            refreshStats(storedId!);
        } catch (e) {
            console.error("Failed to load user", e);
        }
    };

    const refreshStats = async (id: string = userId) => {
        if (!id) return;
        try {
            const API_URL = 'http://10.0.2.2:8000';
            const res = await fetch(`${API_URL}/user-stats/${id}`);
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.log("Offline or API Error", e);
        }
    };

    return (
        <UserContext.Provider value={{ userId, stats, refreshStats }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};
