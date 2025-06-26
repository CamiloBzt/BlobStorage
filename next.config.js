const path = require('path');
const NextFederationPlugin = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // eslint-disable-next-line quotes
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [],
  },
  publicRuntimeConfig: {},
  webpack(config, options) {
    const { isServer } = options;
    const pathBundle = `/_next/static/${
      isServer ? 'ssr' : 'chunks'
    }/remoteEntry.js`;
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    config.plugins.push(
      new NextFederationPlugin({
        name: 'pendig-fro-blob-storage-mf-react-next',
        remotes: {
          contenedor: `${process.env.NEXT_PUBLIC_URL_CONTENEDOR}${pathBundle}`,
        },
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './PageProvider': './src/components/PageProvider/PageProvider.tsx',
        },
        extraOptions: {
          exposePages: true,
          enableImageLoaderFix: true,
          enableUrlLoaderFix: true,
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
