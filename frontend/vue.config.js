const path = require('path')
const manifest = require('./public/manifest.json')

module.exports = {
  outputDir: path.resolve(__dirname, '../backend/public'),
  devServer: {
    proxy: {
      '/socket': {
        target:
          process.env.NODE_ENV === 'production'
            ? 'http://localhost:5000/'
            : 'http://localhost:5000/'
      }
    }
  },
  pwa: {
    themeColor: manifest.theme_color
  }
}
