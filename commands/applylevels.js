const request = require('request')

const getLeaderboard = async (guild) => {
  return new Promise((resolve, reject) => {
    var jar = request.jar()
    jar.setCookie(request.cookie('__cfduid=d498707740b9b2095ed6c8388aa69817e1521733736'), `https://api.tatsumaki.xyz/guilds/${guild}/leaderboard`)

    var options = {
      method: 'GET',
      url: `https://api.tatsumaki.xyz/guilds/${guild}/leaderboard`,
      headers: { authorization: require('../data/tatsuAuth.json').token },
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

    this.thot.on('LONG_PULSE', this.handle.bind(this))
  }

  async handle (guildid) {
    let guild = this.thot.client.guilds.get(guildid)

    let levels = this.thot.get('levels', guild.id)
    let tatsumirror = this.thot.get('tatsumakiMirror', guild.id)

    let levelRoles = levels.map(level => level.role)

    let leaderboard = await getLeaderboard(guild.id)
    if (leaderboard.error) { /* message.channel.send(`Tatsumaki API error \`\`\`${leaderboard.error}\`\`\``) */ return }

    let changes = []

    leaderboard.forEach((user) => {
      if (!user || user === null) { return false }
      if (tatsumirror[user.user_id] && tatsumirror[user.user_id].score !== user.score) {
        changes.push(user)
      }
    })

    this.thot.set('tatsumakiMirror', guild.id, leaderboard)

    await changes.forEach(async user => {
      let highestLevel = {score: 0}
      levels.forEach(level => {
        if (level.score > highestLevel.score && user.score > level.score) {
          highestLevel = level
        }
      })
      let member = await guild.members.get(user.user_id)
      if (!member) { member = await guild.fetchMember(user.user_id) }
      await member.removeRoles([...levelRoles])
      await member.addRole(highestLevel.role)
    })
  }
}

module.exports = applylevels
