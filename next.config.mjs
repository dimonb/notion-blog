import withPlaiceholder from '@plaiceholder/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    unoptimized: true,
  },

  output: "export",

  basePath: "/notion-blog",

  // suppress keyv warning
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/\/keyv\//, (data) => {
        delete data.dependencies[0].critical;
        return data;
      })
    );

    return config;
  },
};

export default withPlaiceholder(nextConfig)
