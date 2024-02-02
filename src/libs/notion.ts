import { NotionAPI } from 'notion-client';
import { mapImageUrl } from '@/utils/get-image-url';


export function getRecordMap(id: string) {
    const notion = new NotionAPI({
      authToken: process.env.NOTION_AUTH_TOKEN,
    });
    return notion.getPage(id);
}

function findAllString(obj: any, level = 0) {
  if (level > 10) {
    return [];
  }
  const result: string[] = [];
  if (typeof obj === 'string') {
    result.push(obj);
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      result.push(...findAllString(obj[key], level+1));
    }
  }
  return result;
}

function isImagePath(path: string): boolean {
  // Regular expression to match common image file extensions
  const imagePattern = /\.(jpeg|jpg|gif|png|bmp|svg|webp)$/i;
  return imagePattern.test(path);
}

export async function getImageMap(recordMap: any){
  const imageMap = new Map<string, string>();

  for (const str of findAllString(recordMap)) {
    if (str.startsWith('https://') && isImagePath(str)) {
      imageMap.set(str, await mapImageUrl(str, recordMap));
    }
  }
  return imageMap;
}