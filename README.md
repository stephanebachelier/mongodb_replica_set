# MongoDB Replica Set

## Warning

This script is meant to be used only for dev & testing environment as it comes with no security setup.

It should only be used for localhost or on any secured environment, not into the global internet.

## Description

This script will configure a MongoDB replica set environment and start all the replica set mongod processes.

By default it will create a replica set `rs` of 3 nodes on localhost with a db path of `/srv/mongo`:
- node #1, `rs-0` on port 27017,
- node #2, `rs-1` on port 27018,
- node #3, `rs-2` on port 27019.

Each process will have its own log files streamed to disk :

- access log : `<dbPath>/log/rs-X/access.log`,
- error log : `<dbPath>/log/rs-X/error.log`.

Closing the main process will terminate the three processes.

## Usage

```
const setup = require('mongodb_replica_set')

setup(options)
```

## Options

### Replica Set options

#### name (default: 'rs')

The name of the replica set.

#### baseDir (default '/srv/mongodb')

The base directory of the MongoDB instance. Must be writable by the current user or the process will failed.

#### port (default 27017)

Default MongoDB port.
You can override it to any value N you want and it will use the value N, N+1 and N+2 for the 3 nodes.

#### oplog (default 128)

Use a slow value by default as it should only be used for testing purposes. Not the values you would use in production.

#### nodes (default 3)

The number of nodes to create in the replicat set.

#### ip (default '127.0.0.1')

The ip the server will listen to.

### Generic options

#### mongodPath

The path to find the MongoDB binaries. Useful if you have multiple MongoDB versions to point a specific MongoDB version `bin` path.

#### accessLog (default 'access.log')

The name of a node access log file.

#### errorLog (default 'error.log')

The name of a node error log file.

## Examples

### Programmatically

In the example below a replica set of 3 nodes starting on port 27117, 27118 & 27119 using a MongoDB@4.0 installation in `/usr/local/opt/mongodb@4.0` folder :

```
const setup = require('mongodb_replica_set')

setup({
  rs: {
    port: 27117,
    baseDir: '/opt/mongodb'
  },
  mongo: {
    mongodPath: '/usr/local/opt/mongodb@4.0/bin',
  }
})
```

You can see a local version in the `examples/setup.js` file.

### CLI

This module export the `mrepset` CLI.

```
$ mrepset /usr/local/opt/mongo/bin --baseDir /opt/mongodb
```

Access all options :
```
$ mrepset --help
```

If you want to access [debug](https://npmjs.org/package/debug) logs add the `DEBUG` flag on the CLI with the `mongo:rs` flag.

You can see a local version in the `examples/setup.sh` file which can be run :
```
$ ./examples/setup.sh
```
