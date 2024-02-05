/* eslint-disable import/no-extraneous-dependencies */
import '@/styles/globals.css';
import 'react-notion-x/src/styles.css';
import '@/styles/notion.css';
import '@/styles/paginate.css';

import { getAnalytics } from '@firebase/analytics';
import { initializeApp } from '@firebase/app';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { AppConfig } from '@/utils/AppConfig';
import { RecoilRoot, RecoilEnv } from 'recoil';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      if (AppConfig.firebaseConfig !== undefined) {
        const app = initializeApp(AppConfig.firebaseConfig);
        getAnalytics(app);
      }

      if (AppConfig.tracker !== undefined) {
        import('@openreplay/tracker')
          .then(({ default: Tracker }) => {
            const tracker = new Tracker(AppConfig.tracker);
            tracker.start();
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to load OpenReplay tracker', error);
          });
      }
    }
  }, []);

  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
