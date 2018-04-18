class set {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!set', usage: '<Mention> <Amount>', description: 'Set someones coins.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    let poems = parseInt(message.content.split(' ')[2])
    if (isNaN(poems) || poems < 1) { poems = 0 }

    this.thot.set('poems', mention.id, poems)
    this.thot.emit('TRANSACTION', poems, mention.tag, message.guild.id, 'admin set')

    this.thot.send(message.channel, {
      title: 'Set Coins',
      description: `**${mention.username}** account has been set to contain **${poems} ${poems === 1 ? 'coin' : 'coins'}**`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
    message.delete()
  }
}

module.exports = set
