const request = require('request')

const getLeaderboard = async (guild, token) => {
  return new Promise((resolve, reject) => {
    var jar = request.jar()
    jar.setCookie(request.cookie('__cfduid=d498707740b9b2095ed6c8388aa69817e1521733736'), `https://api.tatsumaki.xyz/guilds/${guild}/leaderboard`)

    var options = {
      method: 'GET',
      url: `https://api.tatsumaki.xyz/guilds/${guild}/leaderboard`,
      headers: { authorization: token },
      jar: 'JAR'
    }

    request(options, function (error, response, body) {
      if (error) resolve({error})
      try { resolve(JSON.parse(body)) } catch (e) { resolve({error: e}) }
    })
  })
}

class applylevels {
  constructor (thot) {
    this.thot = thot

    // this.thot.on('LONG_PULSE', this.handle.bind(this))
    this.thot.register({ command: 'b!applylevels', usage: '', description: '', callback: (message) => { this.handle(message.guild.id, message) }, admin: true })
  }

  async handle (guildid, m) {
    if (m && this.thot.checkPerms(m) !== 1) { return }

    let guild = this.thot.client.guilds.get(guildid)

    let tatsumirror = this.thot.get('tatsumakiMirror', guild.id)
    let tatsutoken = this.thot.get('tatsuAuth', 'token')

    let leaderboard = await getLeaderboard(guild.id, tatsutoken)
    if (leaderboard.error) { /* message.channel.send(`Tatsumaki API error \`\`\`${leaderboard.error}\`\`\``) */ return }

    let changes = []

    leaderboard.forEach((user) => {
      if (!user || user === null) { return false }
      this.thot.set('xp', user.user_id, { points: parseInt(user.score), booster: null, lastGain: 0 })
      if (!tatsumirror[user.user_id]) {
        changes.push(user)
      }
      if (tatsumirror[user.user_id] && tatsumirror[user.user_id].score !== user.score) {
        changes.push(user)
      }

      tatsumirror[user.user_id] = user
    })

    if (changes.length === 0) { return }
    console.log(`applying levels to ${changes.length} users.`)

    this.thot.set('tatsumakiMirror', guild.id, tatsumirror)

    await changes.forEach(async user => {
      try {
        this.thot.set('levels', user.user_id, Math.floor(user.score / 250))
      } catch (e) { }
    })
  }
}

module.exports = applylevels
