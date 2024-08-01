import e from "express";
import React from "react";

export const ContentFilter = ({ setFilter }) => {
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };
};
