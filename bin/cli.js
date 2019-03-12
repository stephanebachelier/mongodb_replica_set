const chalk = require('chalk')

const cli = require('meow')(`
  Usage
  =====
  $ mrepset <mongo-bin-path>

  Description
  ===========
  Create a configure a MongoDB replica set environment and start all the replica set mongod processes.

  Options:
  -------

  ## Replica set options :

    - name          the replica set name (default: rs)
    - baseDir       the data directory (default: /srv/mongodb)
    - port          the port of the first node (default: 27017)
    - oplog         the oplogSize parameter (default: 128)
    - nodes         the number of nodes in replica set (default: 3)
    - ip            the listening ip MongoDB process will be bound to (default: 127.0.0.1)

  ## Other options

    - accessLog     the access log filename (default: 'access.log')
    - errorLog      the error log filename (default: 'error.log')
    - delay         a default delay to wait for the server instances to be up (default: 5000)

`, {
  flags: {
    name: {
      type: 'string',
      default: 'rs',
      alias: 'n'
    },
    baseDir: {
      type: 'string',
      default: '/srv/mongodb',
      alias: 'bd'
    },
    port: {
      type: 'string',
      default: '27017',
      alias: 'p'
    },
    oplog: {
      type: 'string',
      default: '128',
      alias: 'o'
    },
    nodes: {
      type: 'string',
      default: '3',
      alias: 'nd'
    },
    ip: {
      type: 'string',
      default: '127.0.0.1',
      alias: 'i'
    },
    accessLog: {
      type: 'string',
      default: 'access.log',
      alias: 'mp'
    },
    errorLog: {
      type: 'string',
      default: 'error.log',
      alias: 'mp'
    },
    delay: {
      type: 'string',
      default: '5000',
      alias: 'd'
    }
  }
})

const [ mongodPath ] = cli.input

if (!mongodPath) {
  console.log(chalk.bold.red('  Missing path to mongo bin directory !'))
  console.log('  ~>> Example: %s', chalk.cyan('mrepset /usr/local/opt/mongodb@4.0/bin'))
  cli.showHelp()
}

const {
  name,
  baseDir,
  port,
  oplog,
  nodes,
  ip,
  accessLog,
  errorLog,
  delay
} = cli.flags

require('..')({
  rs: {
    name,
    port: parseInt(port),
    baseDir,
    oplog,
    nodes: parseInt(nodes),
    ip
  },
  mongo: {
    mongodPath,
    accessLog,
    errorLog,
    delay
  }
})
