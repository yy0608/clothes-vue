let imgOrigin = ''

if (process.env.NODE_ENV === 'development') { // 开发环境
  imgOrigin = 'http://img.wsweat.cn/'
} else { // 编译环境
  // 测试环境
  if (process.env.type === 'test') {
    imgOrigin = 'http://test.img.jingia.com/'
  // 正式环境
  } else {
    imgOrigin = 'http://img.jingia.com/'
  }
}

module.exports = {
  origin: 'http://localhost:3004/v1',
  imgOrigin,
  qiniuDefaultDirname: 'cache',
  errorImgKey: 'common/nopic.jpg',
  query: {
    page: 1,
    limit: 2
  }
}
