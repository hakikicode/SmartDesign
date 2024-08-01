import React, {useState} from 'react';

interface Collaboration {
    updates: { message: string}[];
    addComment: (comment: string) => void;
    assignTask: (task: string) => void;
}

export const Collaboration = ({ updates, addComment, assignTask}) => {
    const [comment, setComment] = useState('');
    const [task, setTask] = useState('');


    const handleAddComment = () => {
        addComment(comment);
        setComment('');
    };
};