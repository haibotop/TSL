const config = require('../../../webpack.config')

module.exports = {
  files: [
    '../icons/*.svg'
  ],
  fontName: 'Iconfont',
  // classPrefix: 'icon-',
  // baseSelector: '.icon',
  fixedWidth: true,
  types: [
    'eot',
    'woff2',
    'woff',
    'ttf',
    'svg'
  ],
  fileName: `${config.assetsPath}/fonts/[fontname].[hash:7].[ext]`
}
