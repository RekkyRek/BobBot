const EventEmitter = require('events')
const fs = require('fs')

class THOT extends EventEmitter {
  constructor (client, token) {
    super()
    this.client = client
    this.plugins = {}
    this.commands = {}

    if (!fs.existsSync('./data/storage.json')) { fs.writeFileSync('./data/storage.json', '{}') }
    this.storage = require('./data/storage.json')

    require('./events.json').forEach(event => {
      this.client.on(event, (e1, e2) => this.emit(`RAW_${event}`, e1, e2))
    })

    this.on('RAW_message', (message) => {
      let command = message.content.split(' ')[0]
      if (this.commands[command]) {
        this.commands[command].callback(message, new Date())
      }
    })

    this.on('RAW_ready', () => {
      console.log(`Logged in as ${this.client.user.tag}`)

      this.client.guilds.forEach((guild, guildId) => {
        console.log(guildId)
        setInterval(() => this.emit('PULSE', guildId), 60 * 1000)
      })

      let plugins = require('fs').readdirSync('./commands')
      plugins.forEach(plugin => {
        let PLUGIN = require(`./commands/${plugin}`)
        this.plugins[plugin] = new PLUGIN(this)
      })
    })

    setInterval(() => {
      fs.writeFile('./data/storage.json', JSON.stringify(this.storage), () => console.log('DB Stored'))
    }, 60 * 1000)

    this.client.login(token)
  }

  set (table, key, value) {
    if (!this.storage[table]) { this.storage[table] = {} }
    if (!this.storage[table][key]) { this.storage[table][key] = {} }
    this.storage[table][key] = value
  }

  get (table, key) {
    if (!this.storage[table]) { this.storage[table] = {} }
    if (!this.storage[table][key]) { this.storage[table][key] = {} }
    return this.storage[table][key]
  }

  register (data) {
    if (!data.command || !data.usage || !data.callback) { return }
    if (this.commands[data.command]) { return }
    this.commands[data.command] = {
      usage: data.usage,
      callback: data.callback
    }
    console.log(`Registering command ${data.command}`)
  }
}

module.exports = THOT
