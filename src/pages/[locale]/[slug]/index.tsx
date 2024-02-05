import { Metadata } from 'next';
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';

import NotionPage from '@/components/notion-page';
import RelatedPosts from '@/components/posts/related-posts';
import { Meta } from '@/layout/Meta';
import { Post } from '@/types/post';
import Header from '@/components/header';

export const getStaticPaths = async () => {
  const { getAllPostsFromNotion } = await import('@/services/posts');
  const allPosts = await getAllPostsFromNotion();

  return {
    paths: allPosts.map((post) => ({
      params: { locale: post.locale, slug: post.slug },
    })),
    fallback: false,
  };
};

type Props = {
  locale: string;
  slug: string;
  messages: any;
  relatedPosts: Post[];
  recordMap: any;
  imageMap: any;
  post: Post;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.params?.locale as string;
  const slug = context.params?.slug as string;
  const messages = (await import(`@/messages/${locale}/common.json`)).default;
  const { getAllPostsFromNotion } = await import('@/services/posts');
  const { getRecordMap, getImageMap } = await import('@/libs/notion');
  const allPosts = await getAllPostsFromNotion();
  const post = allPosts.find((p: any) => p.slug === slug);

  if (!post) {
    throw new Error('Function not implemented.');
  }

  const recordMap = await getRecordMap(post.id);
  const imageMap = await getImageMap(recordMap);

  const relatedPosts: Post[] = allPosts.filter(
    (p: any) =>
      p.slug !== slug &&
      p.published &&
      p.categories.some((v: any) => post.categories.includes(v))
  );

  return {
    props: {
      messages,
      locale,
      relatedPosts,
      recordMap,
      post,
      imageMap: Object.fromEntries(imageMap),
    },
  };
};

export default function PostPage({
  locale,
  messages,
  post,
  relatedPosts,
  recordMap,
  imageMap,
}: Props) {
  if (!post.published) {
    return (
      <article
        data-revalidated-at={new Date().getTime()}
        className="mx-auto mt-40 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold">Post Not Found</h2>
        <Link href="/blog">
          <span className="mr-2">&larr;</span>
          <span>Go to list page</span>
        </Link>
      </article>
    );
  }

  return (
    <>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="UTC"
      >
        <Meta />
        <article
          data-revalidated-at={new Date().getTime()}
          className="mt-4 flex flex-col items-center md:mt-20"
        >
          <div className="relative aspect-[3/2] w-[90vw] max-w-[900px]">
            <Image
              src={post.cover}
              alt="cover"
              fill
              placeholder="blur"
              blurDataURL={post.blurUrl}
            />
          </div>
          <NotionPage
            post={post}
            recordMap={recordMap}
            imageMap={new Map(Object.entries(imageMap))}
          />
        </article>
        <RelatedPosts posts={relatedPosts} />
      </NextIntlClientProvider>
    </>
  );
}

// export async function generateStaticParams() {
//   const allPosts = await getAllPostsFromNotion();

//   return allPosts.map((post) => ({
//     slug: post.slug,
//     locale: post.locale,
//   }));
// }

// export async function generateMetadata({
//   params: { slug },
// }: {
//   params: { slug: string };
// }): Promise<Metadata> {
//   const allPosts = await getAllPostsFromNotion();
//   const post = allPosts.find((p) => p.slug === slug);

//   return post
//     ? {
//         title: post.title,
//         openGraph: {
//           images: [
//             {
//               url: post.cover,
//               width: 400,
//               height: 300,
//             },
//           ],
//         },
//       }
//     : {};
// }
