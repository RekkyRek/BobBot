class mute {
  constructor (thot) {
    this.thot = thot

    this.thot.on('PULSE', this.checkMuted.bind(this))
    this.thot.register({ command: 'b!mute', usage: '', description: '<Mention> <Time (Minutes)> <Reason (Optional)>', callback: this.handle.bind(this), admin: true })
  }

  async checkMuted (guildId) {
    let muted = this.thot.storage.muted
    let guild = this.thot.client.guilds.get(guildId)

    Object.keys(muted).forEach(async mute => {
      if (muted[mute] === null) { return }
      if (muted[mute].expires - Date.now() <= 0) {
        let user = await guild.fetchMember(mute)
        let roleID = await guild.roles.find('name', 'Muted')

        user.removeRole(roleID)
        this.thot.set('muted', mute, null)
      }
    })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    if (!message.mentions.users.array()[0]) { return }

    let mention = message.mentions.users.array()[0]

    let time = parseInt(message.content.split(' ')[2])
    let reason = message.content.split(' ').slice(3).join(' ') || 'unknown'

    if (!mention || !time || isNaN(time)) { return }

    let mute = { expires: Date.now() + time * 60 * 1000, reason: reason }
    this.thot.set('muted', mention.id, mute)

    let user = await message.guild.fetchMember(mention.id)
    let roleID = message.guild.roles.find('name', 'Muted').id

    user.addRole(roleID)

    user.send(`:mute: You have been muted for **${time} minutes**.\n\n__Reason:__ ${reason}`)

    this.thot.send(message.channel, {
      title: `Mute`,
      description: `**${mention.username}** has successfully been muted for **${time} minutes**.\n\n__Reason:__ ${reason}`,
      color: 431075
    })
  }
}

module.exports = mute
