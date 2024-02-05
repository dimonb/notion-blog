/* eslint-disable @next/next/no-html-link-for-pages */
// pages/index.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import { Meta } from '@/layout/Meta';
import { AppConfig } from '@/utils/AppConfig';
const messages = {meta: {
  title: AppConfig.title,
  description: AppConfig.description,
  keywords: AppConfig.keywords,
  },
  locale: 'en',
};

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    let desiredLanguage = 'en';
    if (savedLanguage && AppConfig.locales.includes(savedLanguage)) {
      desiredLanguage = savedLanguage;
    } else {
      const firstMatchingLanguage = navigator.languages
        .map((lang) => lang.split('-')[0])
        .find((lang) => AppConfig.locales.includes(lang as string));
      if (firstMatchingLanguage) {
        desiredLanguage = firstMatchingLanguage;
      }
    }

    router.replace(`/${desiredLanguage}`);
  }, [router]);

  // Render a loading state or null while redirecting
  return (
    <>
      <NextIntlClientProvider locale='en' messages={messages} timeZone="UTC">
      <Meta />
      </NextIntlClientProvider>
      <noscript>
        {AppConfig.locales.map((x: string) => (
          <a key={x} href={`/${x}`}>
            {x}
            <br />
          </a>
        ))}
      </noscript>
    </>
  );
}
