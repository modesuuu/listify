module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://listify.rpl1.my.id/api/:path*',
        },
      ]
    },
  }
  