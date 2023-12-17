/** @type {import('next').NextConfig} */
// Dotenv config
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: `${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com`,
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: `ths-website.s3.ap-south-1.amazonaws.com`,
        port: '',
        pathname: '/**'
      }
    ],
  },
}

module.exports = nextConfig
