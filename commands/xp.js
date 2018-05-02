const moment = require('moment')

class xp {
  constructor (thot) {
    this.thot = thot

    this.thot.on('RAW_message', this.handle.bind(this))
    this.thot.register({ command: 'b!xpignore', usage: '', description: 'Toggles if XP should be ignored in current channel.', callback: this.xpignore.bind(this), admin: true })
    this.thot.register({ command: 'b!setbooster', usage: '<User> <Multiplier>', description: 'Set someones booster.', callback: this.setbooster.bind(this), admin: true })
    this.thot.register({ command: 'b!xp', usage: '', description: 'Shows your current xp.', callback: this.xp.bind(this), admin: false })
    this.thot.register({ command: '!exellaisgay', usage: '', description: 'Tru.', callback: this.exella.bind(this), admin: false })
  }

  async exella (message) {
    let xd = ['tru lol', 'ikr xd', 'lol exella gib gey', 'nice meme', 'exella big gey', 'lol big gey', 'lol tru xd']
    message.channel.send(xd[Math.floor(Math.random() * xd.length)])
  }

  async xpignore (message) {
    if (this.thot.checkPerms(message) !== 1) { return }
    let ic = this.thot.get('xp', 'ignoredChannels')
    if (ic[message.channel.id] === undefined) { ic[message.channel.id] = false }
    ic[message.channel.id] = !ic[message.channel.id]
    this.thot.set('xp', 'ignoredChannels', ic)

    this.thot.send(message.channel, {
      title: `Ignore XP`,
      description: ic[message.channel.id] ? `Messages from this channel are no longer counted towards XP` : `Messages in this channel now count towards XP`,
      color: 431075
    })
  }

  async handle (message) {
    if (message.author.id === this.thot.client.user.id) { return }
    if (message.author.bot) { return }

    let ic = this.thot.get('xp', 'ignoredChannels')
    if (ic[message.channel.id]) { return }

    let userxp = this.thot.get('xp', message.author.id)
    if (!userxp) { userxp = { points: 0, booster: null, lastGain: 0 } }

    let multiplier = 1

    if (Date.now() - userxp.lastGain < 2 * 60 * 1000) { return }

    if (userxp.booster) {
      if (Date.now() - userxp.booster.expires < 24 * 60 * 60 * 1000) {
        multiplier = userxp.booster.multiplier
      } else {
        userxp.booster = null
      }
    }

    let points = Math.floor((10 + Math.floor(Math.random() * 10)) * multiplier)

    userxp.points += points
    userxp.lastGain = Date.now()

    console.log(`Gave ${points} to ${message.author.username}, total: ${userxp.points}`)

    this.thot.set('xp', message.author.id, userxp)
  }

  async setbooster (message) {
    if (this.thot.checkPerms(message) !== 1) { return }
    let user = message.mentions.users.array()[0]
    let multiplier = message.content.split(' ')[2]
    let expires = Date.now() + (24 * 60 * 60 * 1000)

    if (!user || !multiplier || !expires) {
      return
    }

    let userxp = this.thot.get('xp', user.id)
    if (!userxp) { userxp = { points: 0, booster: null, lastGain: 0 } }

    userxp.booster = {
      multiplier,
      expires
    }

    message.react('439143886431191051')
  }

  async xp (message) {
    let name = null
    let isMe = true
    let userxp = this.thot.get('xp', message.author.id)
    if (!userxp) { userxp = { points: 0, booster: null, lastGain: 0 } }

    let dur

    if (userxp.booster) {
      if (Date.now() - userxp.booster.expires > 24 * 60 * 60 * 1000) { userxp.booster = null }
      dur = moment.duration(userxp.booster.expires - Date.now())
    }

    let hasBooster = userxp.booster !== null

    this.thot.send(message.channel, {
      title: `${isMe ? 'Your' : name + '\'s'} XP`,
      description: `${isMe ? 'You currently have' : name + 'currently has'}  **${userxp.points} xp**\n\n__Current Boosters__\n${
        hasBooster ? `Your **${userxp.booster.multiplier}x** booster expires in **${dur.hours()} hours, ${dur.minutes()} minutes and ${dur.seconds()} seconds.**` : 'None'
      }`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
  }
}

module.exports = xp
