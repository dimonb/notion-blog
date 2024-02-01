import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs';
import path from 'path';

export async function getBlurImage(src: string) {
  let buffer;

  if (src.startsWith('http://') || src.startsWith('https://')) {
    // Fetch from remote
    buffer = await fetch(src).then(async (res) => Buffer.from(await res.arrayBuffer()));
  } else {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const srcWithoutBasePath = basePath ? src.replace(basePath, '') : src;
    const filePath = path.join(process.cwd(), 'public', srcWithoutBasePath);
    buffer = fs.readFileSync(filePath);
  };

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
}
