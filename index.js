const conf = require('./conf')
const execa = require('execa')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const log = require('debug')('mongo:rs')
const chalk = require('chalk')
const mongo = require('./mongo')
const rs = require('./rs')
const sleep = require('sleepjs')

module.exports = async (options) => {
  try {
    const replicaSet = await conf(options.rs)
    const {
      mongodPath,
      accessLog = 'access.log',
      errorLog = 'error.log',
      delay = 5000
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
        child.stdout
          .pipe(fs.createWriteStream(path.join(nodeLogDir, accessLog)))
        child.stderr
          .pipe(fs.createWriteStream(path.join(nodeLogDir, errorLog)))

        children.push(child)
      } catch (e) {
        console.error(e.message)
      }
    })

    await sleep(delay)
    const client = await mongo(`mongodb://${replicaSet.nodes[0].host}`)
    let status = await rs.status(client)

    if (status.codeName === 'NotYetInitialized') {
      await rs.initiate(client, replicaSet)

      await sleep(delay)

      status = await rs.status(client)
    }

    if (status.members) {
      log('replica set status')
      status.members.forEach(({ name, state }, index) => {
        log('* %s ~> %s : %s', chalk.cyan(`#${index}`), chalk.bold.red(name), chalk.green(state))
      })
    }
  } catch (e) {
    console.error(e)
  }
}
