export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'Cloud Native Nordics',
    title: 'Cloud Native Nordics',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Cloud Native Nordics' },
      { name: 'twitter:description', content: process.env.npm_package_description || '' },
      // image must be an absolute path
      { name: 'twitter:image', content: 'https://cloudnativenordics.com/social-media.png' },
      // Facebook OpenGraph
      { property: 'og:title', content: 'Cloud Native Nordics' },
      { property: 'og:site_name', content: 'Cloud Native Nordics' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://cloudnativenordics.com/social-media.png' },
      { property: 'og:description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
,
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap'
      },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/helpers',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    "@nuxtjs/vuetify",
    '@nuxtjs/pwa',
    '@nuxtjs/apollo',
  ],

  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
    }
  },

  apollo: {
    // required
    clientConfigs: {
      default: {
        httpEndpoint: 'https://stats-api.cloudnativenordics.com/query',
        // httpEndpoint: 'http://localhost:8080/query',
        // Enable Automatic Query persisting with Apollo Engine
        persisting: true,
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
