const moment = require('moment')

class xp {
  constructor (thot) {
    this.thot = thot

    this.thot.on('RAW_message', this.handle.bind(this))
    this.thot.register({ command: 'b!setbooster', usage: '<User> <Multiplier>', description: 'Set someones booster.', callback: this.setbooster.bind(this), admin: true })
    this.thot.register({ command: 'b!xp', usage: '', description: 'Shows your current xp.', callback: this.xp.bind(this), admin: true })
  }

  async handle (message) {
    if (message.author.id === this.thot.client.user.id) { return }

    let userxp = this.thot.get('xp', message.author.id)
    if (!userxp) { userxp = { points: 0, booster: null, lastGain: new Date(0) } }

    let multiplier = 1

    if (Date.now() - new Date(userxp.lastGain) < 2 * 60 * 1000) { console.log(Date.now() - new Date(userxp.lastGain)); return }

    if (userxp.booster) {
      if (Date.now() - new Date(userxp.booster.expires) < 24 * 60 * 60 * 1000) {
        multiplier = userxp.booster.multiplier
      } else {
        userxp.booster = null
      }
    }

    let points = (10 + Math.floor(Math.random() * 10)) * multiplier

    userxp.points = points
    userxp.lastGain = Date.now()

    console.log(userxp)

    this.thot.set('xp', message.author.id, userxp)
  }

  async setbooster (message) {
    if (!this.thot.checkPerms(message)) { return }
    let user = message.mentions.users.array()[0]
    let multiplier = message.content.split(' ')[2]
    let expires = Date.now() + (24 * 60 * 60 * 1000)

    if (!user || !multiplier || !expires) {
      return
    }

    let userxp = this.thot.get('xp', user.id)
    if (!userxp) { userxp = { points: 0, booster: null, lastGain: new Date(0) } }

    userxp.booster = {
      multiplier,
      expires: Date.now() + (expires * 1000)
    }
  }

  async xp (message) {
    let name = null
    let isMe = true
    let userxp = this.thot.get('xp', message.author.id)
    if (!userxp) { userxp = { points: 0, booster: null, lastGain: new Date(0) } }

    if (Date.now() - new Date(userxp.booster.expires) > 24 * 60 * 60 * 1000) { userxp.booster = null }

    let hasBooster = userxp.booster !== null
    let dur = moment.duration(new Date(userxp.booster.expires) - new Date())

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
