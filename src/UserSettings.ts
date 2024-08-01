import React from 'react';

export const UserSettings = ({userSetting, setUserSetting }) => {
    const handleInputChange =(e) => {
        const { name, value } = e.target;
        setUserSetting((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };
}