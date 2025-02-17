module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://listify.rpl1.my.id/api/:path*',
        },
      ]
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  }
  