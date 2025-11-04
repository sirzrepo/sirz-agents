// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "sincere-spoonbill-570.convex.cloud",
//         port: "",
//         pathname: "/api/**",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;


// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable in dev
  fallbacks: {
    document: '/offline',
  }
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
}

module.exports = withPWA(nextConfig)