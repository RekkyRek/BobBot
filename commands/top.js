class top {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!top', usage: '<Page>', description: 'Shows the poems leaderboard.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let poems = this.thot.storage.poems
    if (!poems) { return }

    let page = 0

    if (!isNaN(parseInt(message.content.split(' ')[1]))) { page = parseInt(message.content.split(' ')[1]) }

    let leaderboard = []

    Object.keys(poems).forEach(key => {
      leaderboard.push({
        userid: key,
        poems: poems[key]
      })
    })

    leaderboard.sort((a, b) => {
      if (a.poems > b.poems) return -1
      if (a.poems < b.poems) return 1
      return 0
    })

    if (page > 0) {
      leaderboard = leaderboard.slice(10 * page + 1, 10 * page + 11)
    } else {
      leaderboard = leaderboard.slice(0, 11)
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

      console.log(uid.userid, user)

      topStr += `**[${i + (page * 10) + 1}]** ${user.user.username}#${user.user.discriminator} - ${uid.poems} ${poems === 1 ? 'poem' : 'poems'}\n`
      i++
    })

    this.thot.send(message.channel, {
      title: `Poem Leaderboard`,
      description: topStr,
      color: 431075
    })
    message.delete()
  }
}

module.exports = top
