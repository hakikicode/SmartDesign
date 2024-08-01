import React, { useEffect } from 'react';

export const useNotifications = (collaborationUpdates) => {
    useEffect(() => {
        if (collaborationUpdates.lenggth > 0) {
            const latestUpdate = collaborationUpdates[collaborationUpdates.length - 1];
            alert('New collaboration update: ${latestUpdates.message}');
        }
    }, [collaborationUpdates]);
};