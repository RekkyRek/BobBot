class top {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!top', usage: '<Page>', description: 'Shows the token leaderboard.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let tokens = this.thot.storage.tokens
    if (!tokens) { return }

    let page = 0

    if (!isNaN(parseInt(message.content.split(' ')[1]))) { page = parseInt(message.content.split(' ')[1]) - 1 }

    let leaderboard = []

    Object.keys(tokens).forEach(key => {
      if (isNaN(parseInt(tokens[key]))) { tokens[key] = 0 }
      leaderboard.push({
        userid: key,
        tokens: tokens[key]
      })
    })

    leaderboard.sort((a, b) => {
      if (a.tokens > b.tokens) return -1
      if (a.tokens < b.tokens) return 1
      return 0
    })

    if (page > 0) {
      leaderboard = leaderboard.slice(10 * page + 1, 10 * page + 11)
    } else {
      leaderboard = leaderboard.slice(0, 10)
    }

    if (leaderboard.length === 0) {
      this.thot.send(message.channel, {
        title: `Poem Leaderboard`,
        description: `Page ${page} is out of range.`,
        color: 15347007
      })
      message.delete()
      return
    }

    let topStr = ''
    let i = 1

    await leaderboard.forEach(async uid => {
      let user = message.guild.members.get(uid.userid)
      if (!user) { user = await message.guild.fetchMember(uid.userid) }

      if (isNaN(parseInt(uid.tokens))) {
        uid.tokens = 0
        this.thot.set('tokens', uid.userid, uid.tokens)
      }

      if (i === 1 && page === 0) {
        topStr += `**[${i + (page * 10)}]** ${user.user.username}#${user.user.discriminator} - more than u\n`
      } else {
        topStr += `**[${i + (page * 10)}]** ${user.user.username}#${user.user.discriminator} - ${uid.tokens} ${tokens === 1 ? 'token' : 'tokens'}\n`
      }

      i++
    })

    this.thot.send(message.channel, {
      title: `Tokens Leaderboard`,
      description: topStr,
      color: 431075
    })
    message.delete()
  }
}

module.exports = top
