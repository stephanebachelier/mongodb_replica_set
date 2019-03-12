const readline = require('readline')
const log = require('debug')('mongo:rs')
const chalk = require('chalk')

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const keyMap = new Map();

keyMap.set('s', 'status')
keyMap.set('q', 'quit')
keyMap.set('i', 'initiate')

module.exports = commandMap => {
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      commandMap.quit()
    } else {
      if (keyMap.has(str)) {
        const name = keyMap.get(str)
        log('Execute command %s', chalk.cyan(str))
        commandMap[keyMap.get(str)]()
      } else {
        log('Command %s not supported', chalk.bold.red(str))
      }
    }
  });
}
