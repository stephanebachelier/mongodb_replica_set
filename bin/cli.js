#!/usr/bin/env node

const cli = require('meow')(`
  Usage
  =====
  $ mrepset

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

    - mongoPath     path to the mongo bin folder (default: none as it will use the mongo binaries from the PATH)
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
      alias: 'b'
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
      alias: 'c'
    },
    ip: {
      type: 'string',
      default: '127.0.0.1',
      alias: 'i'
    },
    mongoPath: {
      type: 'string',
      alias: 'm'
    },
    accessLog: {
      type: 'string',
      default: 'access.log',
      alias: 'a'
    },
    errorLog: {
      type: 'string',
      default: 'error.log',
      alias: 'e'
    },
    delay: {
      type: 'string',
      default: '5000',
      alias: 'd'
    }
  }
})

const {
  name,
  baseDir,
  port,
  oplog,
  nodes,
  ip,
  mongoPath,
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
    mongoPath,
    accessLog,
    errorLog,
    delay
  }
})
