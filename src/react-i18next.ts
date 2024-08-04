import React, {useState} from 'react';

import { useTranslation } from 'react-i18next';
const {t, i18n } = useTranslation();

const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
};

