class give {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!give', usage: '<Mention> <Amount>', description: 'Give tokens to someone.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    let toGive = parseInt(message.content.split(' ')[2])
    if (isNaN(toGive) || toGive < 1) { toGive = 1 }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    let tokens = this.thot.get('tokens', mention.id)
    if (isNaN(tokens)) { tokens = 0 }

    tokens += toGive

    this.thot.set('tokens', mention.id, tokens)
    this.thot.emit('TRANSACTION', toGive, mention.tag, message.guild.id, 'admin give')

    this.thot.send(message.channel, {
      title: 'Give Tokens',
      description: `**${mention.username}** has been awarded **${toGive} ${toGive === 1 ? 'coin' : 'tokens'}** for a total of **${tokens} ${tokens === 1 ? 'coin' : 'tokens'}**`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
    message.delete()
  }
}

module.exports = give
