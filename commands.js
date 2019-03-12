const log = require('debug')('mongo:rs')
const chalk = require('chalk')
const rs = require('./rs')

module.exports = (client, replicaSet) => ({
  initiate: async () => {
    await rs.initiate(client, replicaSet)
  },

  status: async () => {
    let status = await rs.status(client)

    if (status.codeName === 'NotYetInitialized') {
      console.log(chalk.red('no replica set initialized'))
      return false
    }

    if (status.members) {
      console.log(chalk.cyan('replica set status'))
      status.members.forEach(({ name, state }, index) => {
        console.log('* %s ~> %s : %s', chalk.cyan(`#${index}`), chalk.bold.red(name), chalk.green(state))
      })
    }

    return status
  },

  url: () => {
    console.log(chalk.cyan('replica set url'))
    console.log('%s', chalk.green(rs.url(replicaSet)))
  }
})
