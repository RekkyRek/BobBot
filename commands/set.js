class set {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!set', usage: '<Mention> <Amount>', description: 'Set someones tokens.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    let tokens = parseInt(message.content.split(' ')[2])
    if (isNaN(tokens) || tokens < 1) { tokens = 0 }

    this.thot.set('tokens', mention.id, tokens)
    this.thot.emit('TRANSACTION', tokens, mention.tag, message.guild.id, 'admin set')

    this.thot.send(message.channel, {
      title: 'Set Tokens',
      description: `**${mention.username}** account has been set to contain **${tokens} ${tokens === 1 ? 'coin' : 'tokens'}**`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
    message.delete()
  }
}

module.exports = set
