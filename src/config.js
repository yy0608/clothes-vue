// console.log(process.env.NODE_ENV === 'development')

module.exports = {
  origin: 'http://localhost:3004/v1',
  imgOrigin: 'http://img.wsweat.cn/',
  qiniuDefaultDirname: 'cache',
  errorImgKey: 'common/nopic.jpg',
  query: {
    page: 1,
    limit: 2
  }
}
