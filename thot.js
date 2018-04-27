const Discord = require('discord.js')

const EventEmitter = require('events')
const fs = require('fs')
const sha1 = require('js-sha1')

class THOT extends EventEmitter {
  constructor (client, token) {
    super()
    this.client = client
    this.plugins = {}
    this.commands = {}

    this.storage = {}
    this.storageHash = {}

    fs.readdirSync('./data').forEach(table => {
      if (table.split('.')[1] !== 'json') { return }
      let fileData = fs.readFileSync(`./data/${table}`)
      this.storage[table.split('.')[0]] = JSON.parse(fileData)
      this.storageHash[table.split('.')[0]] = sha1(fileData)
    })

    console.log(this.storageHash)

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

      this.client.user.setActivity('you. b!help', { type: 'WATCHING' })

      this.client.guilds.forEach((guild, guildId) => {
        console.log(guildId)
        setInterval(() => this.emit('PULSE', guildId), 60 * 1000)
        setInterval(() => this.emit('LONG_PULSE', guildId), 5 * 60 * 1000)
      })

      let plugins = require('fs').readdirSync('./commands')
      plugins.forEach(plugin => {
        let PLUGIN = require(`./commands/${plugin}`)
        this.plugins[plugin] = new PLUGIN(this)
      })
    })

    setInterval(() => this.emit('GLOBAL_PULSE'), 60 * 1000)
    setInterval(() => this.emit('LONG_GLOBAL_PULSE'), 5 * 60 * 1000)

    setInterval(() => {
      Object.keys(this.storage).forEach(table => {
        let fileData = JSON.stringify(this.storage[table])
        let hash = sha1(fileData)
        if (this.storageHash[table] !== hash) {
          this.storageHash[table.split('.')[0]] = hash
          fs.writeFile(`./data/${table}.json`, fileData, () => {})
          console.log(`Wrote change for ${table} to disk.`)
        }
      })
    }, 15 * 1000)

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

  checkPerms (message) {
    let BotOPRole = message.guild.roles.find('name', 'Bot Operator')
    return message.member.roles.get(BotOPRole.id) !== undefined
  }

  send (channel, data) {
    return channel.send(new Discord.RichEmbed(data))
  }

  register (data) {
    if (this.commands[data.command]) { return }
    this.commands[data.command] = {
      usage: data.usage,
      description: data.description,
      callback: data.callback,
      admin: data.admin
    }
    console.log(`Registering command ${data.command}`)
  }
}

module.exports = THOT
