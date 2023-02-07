module.exports = {
    mount: {
      public: '/',
      src: '/_dist_',
    },
    plugins: [
      [
        '@snowpack-plugin-ejs',
        {
          ext: '.ejs',
        },
      ],
    ],
  };
  