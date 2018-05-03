class set {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!pass', usage: '<Mention>', description: 'Pass your bomb to someone.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    if (mention.id === message.author.id) { return }

    let bombHolder = this.thot.get('roles', message.guild.id)['bombholder']

    if (!message.member.roles.get(bombHolder)) { return }

    message.member.removeRole(bombHolder)
    let user = await message.guild.fetchMember(mention.id)
    user.addRole(bombHolder)

    message.channel.send(`:bomb: You passed the bomb to <@${user.id}>`)
  }
}

module.exports = set
