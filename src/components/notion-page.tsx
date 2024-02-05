'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useTheme } from 'next-themes';
import { Block, ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';

import CategoryList from '@/components/category-list';
import useMounted from '@/hooks/use-mounted';
import { Post } from '@/types/post';


export default function NotionPage({
  post,
  recordMap,
  imageMap,
}: {
  post: Post;
  recordMap: ExtendedRecordMap;
  imageMap: Map<string, string>;  
}) {
  const { theme } = useTheme();
  const mounted = useMounted();

  return (
    <NotionRenderer
      darkMode={false}
      recordMap={recordMap}
      fullPage
      forceCustomImages
      showTableOfContents
      disableHeader
      pageHeader={
        <div className="mb-4">
          <CategoryList categories={post.categories} />
        </div>
      }
      mapImageUrl={(url: any, block: any) => mapUrl(imageMap, url)}
      components={{
        Code,
        Collection: () => null,
        Equation,
        Modal,
        nextImage: Image,
      }}
    />
  );
}

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
);
// const Collection = dynamic(() =>
//   import('react-notion-x/build/third-party/collection').then(
//     (m) => m.Collection
//   )
// );
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
);
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false,
  }
);

function mapUrl(imageMap: Map<string, string>, url: string) {
  if (imageMap && imageMap.has(url)) {
    return imageMap.get(url) || url;
  }
  console.debug('mapUrl', JSON.stringify(imageMap));
  return url;
}