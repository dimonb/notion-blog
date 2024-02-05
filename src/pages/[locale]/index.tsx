/* eslint-disable @next/next/no-html-link-for-pages */
import type { GetStaticProps, NextPage } from 'next';
import CategoryFilter from '@/components/filter/category-filter';
import SearchBar from '@/components/filter/search-bar';
import PostsGrid from '@/components/posts/posts-grid';
import { toUniqueArray } from '@/utils/to-unique-array';
import { RecoilRoot } from 'recoil';
import { AppConfig } from '@/utils/AppConfig';


export const metadata = {
  title: 'Blog',
  description: 'Watsu blog page',
};

/*export async function generateStaticParams() {
  const { getAllPostsFromNotion } = await import('@/services/posts');
  const allPosts = await getAllPostsFromNotion();

  return allPosts.map((post) => ({
    locale: post.locale,
  }));
}*/

export const getStaticPaths = async () => {
  return {
    paths: AppConfig.locales.map((locale) => ({ params: { locale } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.params?.locale as string;
  const messages = (await import(`@/messages/${locale}/common.json`)).default;
  const { getAllPostsFromNotion } = await import('@/services/posts');
  const allPosts = await getAllPostsFromNotion();
  return {
    props: {
      messages,
      locale,
      allPosts,
    },
  };
};

type Props = {
  locale: string;
  messages: any;
  allPosts: any;
};

export default function BlogPage({locale, messages, allPosts}: Props) {

  const allCategories = toUniqueArray(
    allPosts
      .filter((post: { published: any; locale: string; }) => post.published && post.locale === locale)
      .map((post: { categories: any; }) => post.categories)
      .flat()
  ).sort();

  return (
    <>
      <section className="mb-16 mt-0 space-y-8 md:mt-20">
        {/* <SearchBar /> */}
        <CategoryFilter allCategories={allCategories as string[]} />
      </section>
      <PostsGrid allPosts={allPosts.filter((post: { published: any; locale: string; }) => post.published && post.locale === locale)} />
    </>
  );
}
