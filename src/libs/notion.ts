import { NotionAPI } from 'notion-client';
import { mapImageUrl } from '@/utils/get-image-url';
import { Block } from 'notion-types';


export function getRecordMap(id: string) {
    const notion = new NotionAPI({
      authToken: process.env.NOTION_AUTH_TOKEN,
    });
    return notion.getPage(id);
}

function findAllString(obj: any, level = 0, currentBlock?: Block): any {
  if (level > 10) {
    return [];
  }
  const result = [];
  if (typeof obj === 'string') {
    result.push({obj, currentBlock});
  } else if (typeof obj === 'object') {
    if (obj && obj.id) {
      currentBlock = obj;
    }
    for (const key in obj) {
      result.push(...findAllString(obj[key], level+1, currentBlock));
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
    if (str.obj.startsWith('https://') && isImagePath(str.obj)) {
      imageMap.set(str.obj, await mapImageUrl(str.obj, str.currentBlock));
    }
  }
  return imageMap;
}