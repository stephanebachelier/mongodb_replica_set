const setup = require('..')

const run = async () => {
  await setup({
    rs: {
      port: 27117,
      baseDir: '/opt/mongodb'
    },
    mongo: {
      mongodPath: '/usr/local/opt/mongodb@4.0/bin'
    }
  })
}

run()
