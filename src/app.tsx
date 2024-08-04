import React, { useEffect, useState } from 'react';
import { appProcess, getPlatformInfo, requestOpenExternalUrl } from '@canva/platform';
import { getDesignSuggestions } from './aiSuggestions';
import { generateColorPalette, autoAdjustLayout } from './autoEnhancements';
import { fetchDynamicContent, fetchLiveData } from './contentIntegration';
import { enableCollaboration, integrateFeedback } from './collaboration';

import { findFonts, getTemporaryUrl, requestFontSelection, upload } from '@canva/asset';
import { addAudioTrack, addNativeElement, addPage, getCurrentPageContext, getDefaultPageDimensions, getDesignToken, initAppElement, overlay, requestExport, selection, setCurrentPageBackground, ui } from '@canva/design';
import { auth } from '@canva/user';
import { UserSettings } from './UserSettings';
import { useNotifications } from './useNotifications';
import { Collaboration } from './Collaborations';
import { ContentFilter } from './ContentFilter';
import { useTranslation } from 'react-i18next';

const SERVER_URL = '';

export const App = () => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [design, setDesign] = useState<any>(null);
  const [content, setContent] = useState([]);
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [collaborationUpdates, setCollaborationUpdates] = useState([]);
  const [userSettings, setUserSettings] = useState({
    frontStyle: 'Regular',
    layout: 'Centered'
  });

  const [filter, setFilter] = useState('all');
  const [comment, setComment] = useState('');
  const [task, setTask] = useState('');

  useNotifications(collaborationUpdates);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/updates`);
        const updates = await response.json();
        setCollaborationUpdates(updates);
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    };

    const interval = setInterval(fetchUpdates, 5000); // Fetch updates every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      await appProcess(async (canva) => {
        canva.onEvent('userInput', async (input) => {
          setLoading(true);
          setError(null);
          try {
            const suggestions = await getDesignSuggestions(input, userSettings);
            setSuggestions(suggestions);
            canva.updateSuggestions(suggestions);
          } catch (err) {
            console.error('Failed to fetch design suggestions.');
          }
          setLoading(false);
        });

        canva.onEvent('enhanceDesign', async (design) => {
          setLoading(true);
          setError(null);
          try {
            const palette = generateColorPalette(design.baseColor);
            const adjustedLayout = autoAdjustLayout(design.elements);
            setDesign({ palette, adjustedLayout });
            canva.updateDesign({ palette, adjustedLayout });
          } catch (err) {
            console.error('Failed to enhance design.');
          }
          setLoading(false);
        });

        canva.onEvent('fetchContent', async (theme: string) => {
          setLoading(true);
          setError(null);
          try {
            const content = await fetchDynamicContent(theme);
            setContent(content);
            canva.updateContent(content);
          } catch (err) {
            console.error('Failed to fetch content.');
          }
          setLoading(false);
        });

        canva.onEvent('fetchLiveData', async () => {
          setLoading(true);
          setError(null);
          try {
            const data = await fetchLiveData();
            setLiveData(data);
            canva.updateLiveData(data);
          } catch (err) {
            console.error('Failed to fetch live data.');
          }
          setLoading(false);
        });

        canva.onEvent('collaborate', enableCollaboration);
        canva.onEvent('feedback', integrateFeedback);

        // Fetch user info on app initialization
        try {
          const user = await auth.getCurrentUser();
          setUser(user);
        } catch (err) {
          console.error('Failed to fetch user info', err);
        }
      });
    };

    initializeApp();
  }, [userSettings]);

  const handleAsset = async () => {
    setLoading(true);
    setError(null);
    try {
      const fonts = await findFonts({ searchTerm: 'Roboto' });
      console.log('Fonts:', fonts);
    } catch (error) {
      console.error('Error fetching asset:', error);
    }
    setLoading(false);
  };

  const handleDesign = async () => {
    setLoading(true);
    setError(null);
    try {
      const context = await getCurrentPageContext();
      console.log('Current Page Context:', context);
    } catch (error) {
      console.error('Error fetching design:', error);
    }
    setLoading(false);
  };

  const handleUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await auth.getCurrentUser();
      setUser(user);
      console.log('User:', user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    setLoading(false);
  };

  const addComment = (comment) => {
    setCollaborationUpdates([...collaborationUpdates, { message: comment }]);
  };
  
  const assignTask = (task) => {
    setCollaborationUpdates([...collaborationUpdates, { message: `Task assigned: ${task}` }]);
  };

  const handleAddAudioTrack = async () => {
    setLoading(true);
    setError(null);
    try {
      await addAudioTrack({
        url: '',
        name: 'Audio'
      });
      console.log('Audio track added');
    } catch (error) {
      console.error('Error adding audio track.');
    }
    setLoading(false);
  };

  const handleAddNativeElement = async () => {
    setLoading(true);
    setError(null);
    try {
      await addNativeElement({
        type: 'TEXT',
        properties: {
          text: 'Hello, Canva!',
          frontSize: 23,
          color: '#000000'
        }
      });
      console.log('Native element added');
    } catch (error) {
      console.error('Error adding native element');
    }
    setLoading(false);
  };

  const handleAddPage = async () => {
    setLoading(true);
    setError(null);
    try {
      await addPage();
      console.log('Page added');
    } catch (error) {
      console.error('Error adding page');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Canva SmartDesign Assistant</h1>
      <button onClick={handleAsset}>Get Asset</button>
      <button onClick={handleDesign}>Get Design</button>
      <button onClick={handleUser}>Get User</button>
      <button onClick={handleAddAudioTrack}>Add Audio Track</button>
      <button onClick={handleAddNativeElement}>Add Native Element</button>
      <button onClick={handleAddPage}>Add Page</button>
      <button onClick={() => changeLanguage('en')}>English</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <UserSettings userSettings={userSettings} setUserSettings={setUserSettings} />
      <ContentFilter setFilter={setFilter} />

      <div>
        <h2>{t('Suggestions')}</h2>
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <strong>{suggestion.suggestion}</strong>
              <div>Font Style: {suggestion.details.frontStyle}</div>
              <div>Color: {suggestion.details.color}</div>
              <div>Layout: {suggestion.details.layout}</div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>{t('Design Enhancements')}</h2>
        <pre>{JSON.stringify(design, null, 2)}</pre>
      </div>
      <div>
        <h2>{t('Content')}</h2>
        <ul>
          {content.filter(item => filter === 'all' || item.type === filter).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>{t('Live Data')}</h2>
        <pre>{JSON.stringify(liveData, null, 2)}</pre>
      </div>

      <div>
        <h2>Collaboration</h2>
        <div>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={() => addComment(comment)}>Add Comment</button>
        </div>
        <div>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Assign a task"
          />
          <button onClick={() => assignTask(task)}>Assign Task</button>
        </div>
        <div>
          <h3>Collaboration Updates</h3>
          <ul>
            {collaborationUpdates.map((update, index) => (
              <li key={index}>{update.message}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>User Settings</h2>
          <label>
            Theme:
            <select
              value={userSettings.theme || 'light'}
              onChange={(e) => setUserSettings({ ...userSettings, theme: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};
