class bombsquad {
  constructor (thot) {
    this.thot = thot

    this.thot.on('LONG_PULSE', this.awardBombPoints.bind(this))
    // this.thot.register({ command: 'b!asd', usage: '<Mention>', description: 'Pass your bomb to someone.', callback: this.awardBombPoints.bind(this), admin: false })
    this.thot.register({ command: 'b!pass', usage: '<Mention>', description: 'Pass your bomb to someone.', callback: this.handle.bind(this), admin: false })
    setInterval(() => {
      // let channel = this.thot.guilds.get('421082803669827584').channels.get('441618536461500426')

    }, 1000 * 15)
  }

  async awardBombPoints (guildId) {
    if (guildId.guild) { guildId = guildId.guild.id }
    let guild = this.thot.client.guilds.get(guildId)
    let bombHolder = this.thot.get('roles', guildId)['bombholder']

    let members = guild.roles.get(bombHolder).members

    members.forEach(member => {
      console.log(member.id)
      let bombScore = this.thot.get('bombScore', member.id)
      if (isNaN(bombScore)) bombScore = 0
      bombScore++
      this.thot.set('bombScore', member.id, bombScore)
    })
  }

  async handle (message) {
    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    console.log(mention.id)

    if (mention.id === message.author.id) { return }

    let bombHolder = this.thot.get('roles', message.guild.id)['bombholder']
    let player = this.thot.get('roles', message.guild.id)['player']

    let user = await message.guild.fetchMember(message.author.id)
    if (!user.roles.get(bombHolder)) { return }

    let target = await message.guild.fetchMember(mention.id)
    console.log(target)

    if (!target.roles.get(player)) { return }
    if (target.roles.get(bombHolder)) { message.channel.send(`<:error:439143955133628426> **${target.displayName}** is already holding a bomb.`); return }

    user.removeRole(bombHolder)
    target.addRole(bombHolder)

    message.guild.channels.get('441618953698279435').send(`:bomb: <@${target.id}>, you're now a bomb holder!`)

    message.channel.send(`:bomb: You passed the bomb to **${target.displayName}**`)
  }
}

module.exports = bombsquad
