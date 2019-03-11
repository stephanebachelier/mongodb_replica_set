const conf = require('./conf')
const execa = require('execa')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

module.exports = async (options) => {
  const replicaSets = await conf(options.rs)
  const {
    mongodPath,
    accessLog = 'access.log',
    errorLog = 'error.log'
  } = options.mongo

  let children = []
  process.on('SIGINT', () => {
    console.log('closing children process', children.length)
    children.forEach(child => {
      child.kill('SIGTERM')
    })

    process.exit()
  })

  const logDir = path.join(options.rs.baseDir, 'log')

  replicaSets.forEach(async ({ name, port, dbPath, oplog, ip, node }) => {
    try {
      const child = execa(`${mongodPath}/mongod`, [
         '--replSet', name,
         '--port', port,
         '--dbpath', dbPath,
         '--oplogSize', oplog,
         '--bind_ip', ip,
         '--smallfiles'
      ], {
        detached: true
      })

      const nodeLogDir = path.join(logDir, rs)

      await fse.ensureDir(rsLogDir)

      child.stdout.pipe(fs.createWriteStream(path.join(nodeLogDir, accessLog)))
      child.stderr.pipe(fs.createWriteStream(path.join(nodeLogDir, errorLog)))

      children.push(child)
    } catch (e) {
      console.error(e.message)
    }
  })
}
