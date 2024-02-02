import { Block } from 'notion-types';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';


const cacheDir = path.join('.cache', 'images');
const publicDir = path.join('public', '.img');

// Ensure cache and public directories exist
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function getFileName(url: string): string {
    const hash = createHash('md5').update(url).digest('hex');
    const extension = url.split('.').pop()?.split('?')[0]; // Simplistic way to get file extension
    return `${hash}.${extension}`;
  }
  
  function transformURL(url: string, block: Block) {
    try {
      const u = new URL(url);
  
      if (
        u.pathname.startsWith('/secure.notion-static.com') &&
        u.hostname.endsWith('.amazonaws.com')
      ) {
        if (
          u.searchParams.has('X-Amz-Credential') &&
          u.searchParams.has('X-Amz-Signature') &&
          u.searchParams.has('X-Amz-Algorithm')
        ) {
          // if the URL is already signed, then use it as-is
          return url;
        }
      }
    } catch {
      // ignore invalid urls
    }
  
    if (url.startsWith('/images')) {
      url = `https://www.notion.so${url}`;
    }
  
    url = `https://www.notion.so${
      url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
    }`;
  
    const notionImageUrlV2 = new URL(url);
    let table = block.parent_table === 'space' ? 'block' : block.parent_table;
    if (table === 'collection' || table === 'team') {
      table = 'block';
    }
    notionImageUrlV2.searchParams.set('table', table);
    notionImageUrlV2.searchParams.set('id', block.id);
    notionImageUrlV2.searchParams.set('cache', 'v2');
  
    url = notionImageUrlV2.toString();
  
    return url; 
  }
  
  export function mapImageUrlSync(url: string, block: Block) {
    if (!url || url === 'undefined') {
      return null;
    }
  
    if (url.startsWith('data:')) {
      return url;
    }
  
    const filename = getFileName(url);
    const cachePath = path.join(cacheDir, filename);
    const publicPath = path.join(publicDir, filename);
  
    if (fs.existsSync(publicPath)) {
      return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/.img/${filename}`;
    } else {
      return transformURL(url, block);
    }
  }
  
  export async function mapImageUrl(url: string, block: Block): Promise<string >{
    if (!url || url === 'undefined') {
      return '';
    }
  
    if (url.startsWith('data:')) {
      return url;
    }
  
    const filename = getFileName(url);
    const cachePath = path.join(cacheDir, filename);
    const publicPath = path.join(publicDir, filename);
  
  
    // Check if image is already in public directory
    if (!fs.existsSync(publicPath)) {
      // Check if image is in cache, else download it
      if (!fs.existsSync(cachePath)) {
        try {
          const response = await axios.get(transformURL(url, block), { responseType: 'arraybuffer' });
          fs.writeFileSync(cachePath, response.data);
        } catch (error) {
          console.error('Error downloading image:', error);
          return '';
        }
      }
  
      // Copy from cache to public directory
      fs.copyFileSync(cachePath, publicPath);
    }
  
    // Return public URL
    return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/.img/${filename}`;  
  }
  