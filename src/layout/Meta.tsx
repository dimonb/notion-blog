import Head from 'next/head';
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl';
import { NextSeo } from 'next-seo';
import { AppConfig } from '@/utils/AppConfig';

const Meta = () => {
  const t = useTranslations();
  const currentLocale = t('locale');
  let pathname = usePathname(); // Add this line to fix the error
  if (pathname.startsWith(`/${currentLocale}`)) {
    pathname = pathname.replace(`/${currentLocale}`, '');
  }
  const hreflangLinks = AppConfig.locales.map(locale => (
    <link 
      rel="alternate" 
      hrefLang={locale} 
      href={`${AppConfig.baseURL}/${locale}${pathname}`} 
      key={locale} 
    />
  ));
  hreflangLinks.push(
    <link 
      rel="alternate" 
      hrefLang="x-default" 
      href={`${AppConfig.baseURL}${pathname}`} 
      key="x-default"
    />
  );
  

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="keywords" content={t('meta.keywords')}></meta>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="canonical"
          href={`${AppConfig.baseURL}${usePathname()}`}
        />
        {hreflangLinks}
        <link
          rel="apple-touch-icon"
          href={`/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/favicon-16x16.png`}
          key="icon16"
        />
        <link
          rel="icon"
          href={`/favicon.ico`}
          key="favicon"
        />
      </Head>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
        openGraph={{
          title: t('meta.title'),
          description: t('meta.description'),
          locale: currentLocale,
          site_name: t('meta.title'),
        }}
      />
    </>
  );
};

export { Meta };
