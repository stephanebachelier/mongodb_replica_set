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
const commands = require('./commands')
const stdin = require('./stdin')

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

    // setup commands
    const _commands = commands(client, replicaSet)

    if (!await _commands.status()) {
      await _commands.initiate()
    }

    // give user control
    stdin({
      quit: () => process.kill(process.pid, 'SIGINT'),
      ..._commands
    })
  } catch (e) {
    console.error(e)
  }
}
