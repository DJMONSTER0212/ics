import { useState, useEffect } from 'react';

const useSettings = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/setting');
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSettings();
    }, []);

    return settings;
};

export default useSettings;
