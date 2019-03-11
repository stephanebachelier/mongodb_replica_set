const conf = require('./conf')
const execa = require('execa')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const log = require('debug')('mongo:rs')
const chalk = require('chalk')

module.exports = async (options) => {
  try {
    const replicaSet = await conf(options.rs)
    const {
      mongodPath,
      accessLog = 'access.log',
      errorLog = 'error.log'
    } = options.mongo

    const { name, nodes } = replicaSet

    log('starting replica set [%s] with %s nodes', chalk.cyan(name), chalk.cyan(nodes.length))

    let children = []
    process.on('SIGINT', () => {
      log('closing %s children process', chalk.cyan(children.length))
      children.forEach(child => {
        child.kill('SIGTERM')
      })

      log('Bye !')
      process.exit()
    })

    const logDir = path.join(options.rs.baseDir, 'log')

    nodes.forEach(async ({ port, dbPath, oplog, ip, node }) => {
      try {
        log('starting node %s on %s', chalk.cyan(node), chalk.cyan(`${ip}:${port}`))
        log('monting in %s', chalk.cyan(dbPath))

        const nodeLogDir = path.join(logDir, node)

        await fse.ensureDir(nodeLogDir)

        const child = execa(`${mongodPath}/mongod`, [
           '--replSet', name,
           '--port', port,
           '--dbpath', dbPath,
           '--oplogSize', oplog,
           '--bind_ip', ip,
           '--smallfiles'
        ], {
          detached: true,
        })
        child.stdout.pipe(fs.createWriteStream(path.join(nodeLogDir, accessLog)))
        child.stderr.pipe(fs.createWriteStream(path.join(nodeLogDir, errorLog)))

        children.push(child)
      } catch (e) {
        console.error(e.message)
      }
    })
  } catch (e) {
    console.error(e)
  }
}
