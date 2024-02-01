import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs';
import path from 'path';

export async function getBlurImage(src: string) {
  let buffer;

  if (src.startsWith('http://') || src.startsWith('https://')) {
    // Fetch from remote
    buffer = await fetch(src).then(async (res) => Buffer.from(await res.arrayBuffer()));
  } else {
    // Assume local file from public directory
    const filePath = path.join(process.cwd(), 'public', src);
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
