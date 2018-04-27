const moment = require('moment')

class daily {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!daily', usage: '', description: 'Claim your daily coin reward.', callback: this.handle.bind(this) })
  }

  async handle (message) {
    let daily = this.thot.get('daily', message.author.id)
    console.log(Date.now() - new Date(daily.lastClaimed))
    if (daily && (Date.now() - new Date(daily.lastClaimed) < 24 * 60 * 60 * 1000)) {
      let dur = moment.duration(new Date(daily.lastClaimed + 24 * 60 * 60 * 1000) - new Date())

      this.thot.send(message.channel, {
        title: 'Daily Tokens',
        description: `You can claim your daily tokens in **${dur.hours()} hours, ${dur.minutes()} minutes and ${dur.seconds()} seconds.**`,
        color: 15406156,
        footer: {
          text: `Executed by ${message.author.username}`
        }
      })
      return
    }

    let tokens = this.thot.get('tokens', message.author.id)
    if (isNaN(tokens)) { tokens = 0 }

    let toAdd = 20

    if (isNaN(daily['streak'])) { daily['streak'] = 0 }
    daily['streak'] += 1

    if (Date.now() - new Date(daily.lastClaimed) > 48 * 60 * 60 * 1000) {
      daily['streak'] = 1
    }

    daily['lastClaimed'] = Date.now()
    this.thot.set('daily', message.author.id, daily)

    tokens += toAdd

    this.thot.set('tokens', message.author.id, tokens)

    let streak = daily['streak']
    let streakStr
    switch (streak) {
      case 0: streakStr = '⚫⚫⚫⚫⚫'; break
      case 1: streakStr = '⚪⚫⚫⚫⚫'; break
      case 2: streakStr = '⚪⚪⚫⚫⚫'; break
      case 3: streakStr = '⚪⚪⚪⚫⚫'; break
      case 4: streakStr = '⚪⚪⚪⚪⚫'; break
      case 5: streakStr = '⚪⚪⚪⚪⚪'; toAdd += 10; break
      case 6: streakStr = '🔵⚪⚪⚪⚪'; toAdd += 5; break
      case 7: streakStr = '🔵🔵⚪⚪⚪'; toAdd += 5; break
      case 8: streakStr = '🔵🔵🔵⚪⚪'; toAdd += 5; break
      case 9: streakStr = '🔵🔵🔵🔵⚪'; toAdd += 5; break
      case 10: streakStr = '🔵🔵🔵🔵🔵'; toAdd += 25; break
      case 11: streakStr = '🔴🔵🔵🔵🔵'; toAdd += 10; break
      case 12: streakStr = '🔴🔴🔵🔵🔵'; toAdd += 10; break
      case 13: streakStr = '🔴🔴🔴🔵🔵'; toAdd += 10; break
      case 14: streakStr = '🔴🔴🔴🔴🔵'; toAdd += 10; break
      case 15: streakStr = '🔴🔴🔴🔴🔴'; toAdd += 50; break
      default: streakStr = '🔴🔴🔴🔴🔴'; toAdd += 15; break
    }

    this.thot.send(message.channel, {
      title: 'Daily Tokens',
      description: `You have been awarded **${toAdd} tokens**. You now have a total of **${tokens} tokens**\n\n__${streak === 5 ? 'Streak Complete' : 'Streak'}__\n\n${streakStr}`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
    message.delete()
  }
}

module.exports = daily
