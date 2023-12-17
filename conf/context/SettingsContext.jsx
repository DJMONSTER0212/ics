import React, { createContext } from 'react';
import { useEffect, useState } from "react";

// Setting context
export const SettingsContext = createContext({});

function SettingsProvider({ children }) {
    // For setting
    const [settings, setSettings] = useState()

    useEffect(() => {
        const fetchData = async () => {
            // For setting
            const settingsFetch = await fetch('/api/website/settings/website')
            const settings = await settingsFetch.json()
            setSettings({ website: settings.website });
        }
        fetchData();
    }, [])

    return (
        <>
            {settings && <SettingsContext.Provider value={{ settings, setSettings }}>
                {children}
            </SettingsContext.Provider>
            }
        </>
    );
}

export default SettingsProvider

