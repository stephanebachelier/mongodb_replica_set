const readline = require('readline')
const log = require('debug')('mongo:rs')
const chalk = require('chalk')

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const keyMap = new Map();

keyMap.set('s', 'status')
keyMap.set('q', 'quit')
keyMap.set('u', 'url')
keyMap.set('h', 'help')

const help = () => {
  for (var [key, value] of keyMap) {
    console.log(`key %s ~> %s`, chalk.bold.cyan(key), chalk.bold.cyan(value))
  }
}

module.exports = commandMap => {
  help()
  process.stdin.on('keypress', (str, key) => {
    const { ctrl, name } = key
    if (name === 'h') {
      return help()
    }
    if (ctrl && name === 'c') {
      return commandMap.quit()
    }

    if (keyMap.has(name)) {
      const command = keyMap.get(name)
      log('> %s', chalk.cyan(command))
      commandMap[command]()
    }
  })
}
