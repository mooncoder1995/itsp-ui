// https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
// https://github.com/chimurai/http-proxy-middleware

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api', {
      // target: 'http://59.67.107.169:8010',
      // target: 'http://',
      target: 'http://localhost:8010',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    })
  );
};
