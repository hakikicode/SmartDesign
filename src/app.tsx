import React, { useEffect, useState } from 'react';
import { appProcess, getPlatformInfo, requestOpenExternalUrl } from '@canva/platform';
import { getDesignSuggestions } from './aiSuggestions';
import { generateColorPalette, autoAdjustLayout } from './autoEnhancements';
import { fetchDynamicContent, fetchLiveData } from './contentIntegration';
import { enableCollaboration, integrateFeedback } from './collaboration';

import { findFonts, getTemporaryUrl, requestFontSelection, upload } from '@canva/asset';
import { addAudioTrack, addNativeElement, addPage, getCurrentPageContext, getDefaultPageDimensions, getDesignToken, initAppElement, overlay, requestExport, selection, setCurrentPageBackground, ui } from '@canva/design';
import { auth } from '@canva/user';

export const App = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [design, setDesign] = useState<any>(null);
  const [content, setContent] = useState([]);
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    const initializeApp = async () => {
      await appProcess(async (canva) => {
        canva.onEvent('userInput', async (input: string) => {
          const suggestions = await getDesignSuggestions(input);
          setSuggestions(suggestions);
          canva.updateSuggestions(suggestions);
        });

        canva.onEvent('enhanceDesign', async (design: any) => {
          const palette = generateColorPalette(design.baseColor);
          const adjustedLayout = autoAdjustLayout(design.elements);
          setDesign({ palette, adjustedLayout });
          canva.updateDesign({ palette, adjustedLayout });
        });

        canva.onEvent('fetchContent', async (theme: string) => {
          const content = await fetchDynamicContent(theme);
          setContent(content);
          canva.updateContent(content);
        });

        canva.onEvent('fetchLiveData', async () => {
          const data = await fetchLiveData();
          setLiveData(data);
          canva.updateLiveData(data);
        });

        canva.onEvent('collaborate', enableCollaboration);
        canva.onEvent('feedback', integrateFeedback);
      });
    };

    initializeApp();
  }, []);

  const handleAsset = async () => {
    try {
      const fonts = await findFonts({ searchTerm: 'Roboto' });
      console.log('Fonts:', fonts);
    } catch (error) {
      console.error('Error fetching asset:', error);
    }
  };

  const handleDesign = async () => {
    try {
      const context = await getCurrentPageContext();
      console.log('Current Page Context:', context);
    } catch (error) {
      console.error('Error fetching design:', error);
    }
  };

  const handleUser = async () => {
    try {
      const user = await auth.getCurrentUser();
      console.log('User:', user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <div>
      <h1>Canva SmartDesign Assistant</h1>
      <button onClick={handleAsset}>Get Asset</button>
      <button onClick={handleDesign}>Get Design</button>
      <button onClick={handleUser}>Get User</button>
      <div>
        <h2>Suggestions</h2>
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Design Enhancements</h2>
        <pre>{JSON.stringify(design, null, 2)}</pre>
      </div>
      <div>
        <h2>Content</h2>
        <ul>
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Live Data</h2>
        <pre>{JSON.stringify(liveData, null, 2)}</pre>
      </div>
    </div>
  );
};
