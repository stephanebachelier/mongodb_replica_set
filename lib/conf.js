const fse = require('fs-extra')
const path = require('path')
const defaultsDeep = require('lodash/defaultsDeep')

module.exports = async function (options = {}) {
  const opts = {}

  defaultsDeep(opts, options, {
    name: 'rs',
    baseDir: '/srv/mongodb',
    port: 27017,
    oplog: 128,
    nodes: 3,
    ip: '127.0.0.1'
  })

  const { name, baseDir, port, oplog, nodes, ip } = opts

  const replicaSets = {
    name,
    nodes: []
  }
  const basePort = parseInt(port)

  let i = 0
  for (; i < nodes; i += 1) {
    const port = basePort + i
    const node = `${name}-${i}`
    const dbPath = path.join(baseDir, node)

    replicaSets.nodes.push({
      index: i,
      node,
      port,
      dbPath,
      oplog,
      ip,
      host: `${ip}:${port}`
    })
    await fse.ensureDir(dbPath)
  }

  return replicaSets
}
