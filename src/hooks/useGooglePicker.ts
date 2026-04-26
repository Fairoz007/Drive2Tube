import { useState, useCallback, useEffect } from 'react';

// Declare types for Google API
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface UseGooglePickerOptions {
  apiKey: string;
  clientId: string;
  appId: string;
  onSelect: (data: any) => void;
  viewId?: string; // e.g., 'FOLDERS' or 'DOCS'
  mimeTypes?: string;
}

export function useGooglePicker({
  apiKey,
  clientId,
  appId,
  onSelect,
  viewId = 'FOLDERS',
  mimeTypes,
}: UseGooglePickerOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeGapi = () => {
      window.gapi.load('client:picker', () => {
        setIsLoaded(true);
      });
    };

    const initializeGsi = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (response: any) => {
          if (response.error !== undefined) {
            throw response;
          }
          setAccessToken(response.access_token);
          createPicker(response.access_token);
        },
      });
      setTokenClient(client);
    };

    if (window.gapi && window.google) {
      initializeGapi();
      initializeGsi();
    }
  }, [clientId]);

  const createPicker = useCallback((token: string) => {
    const view = viewId === 'FOLDERS' 
      ? new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS)
          .setSelectFolderEnabled(true)
          .setIncludeFolders(true)
      : new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);

    if (mimeTypes) {
      view.setMimeTypes(mimeTypes);
    }

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(appId)
      .setOAuthToken(token)
      .addView(view)
      .setDeveloperKey(apiKey)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          onSelect(data);
        }
      })
      .build();

    picker.setVisible(true);
  }, [apiKey, appId, onSelect, viewId, mimeTypes]);

  const openPicker = useCallback(() => {
    if (!tokenClient) return;

    if (!accessToken) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      createPicker(accessToken);
    }
  }, [tokenClient, accessToken, createPicker]);

  return { isLoaded, openPicker };
}
