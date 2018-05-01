class withdraw {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!withdraw', usage: '<Mention> <Amount>', description: 'Take tokens away from someone.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (this.thot.checkPerms(message) !== 1) { return }

    let toWithdraw = parseInt(message.content.split(' ')[2])
    if (isNaN(toWithdraw) || toWithdraw < 1) { toWithdraw = 1 }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    let tokens = this.thot.get('tokens', mention.id)
    if (isNaN(tokens)) { tokens = 0 }

    tokens -= toWithdraw

    this.thot.set('tokens', mention.id, tokens)
    this.thot.emit('TRANSACTION', -toWithdraw, mention.tag, message.guild.id, 'admin withdraw')

    this.thot.send(message.channel, {
      title: 'Withdraw Tokens',
      description: `**${toWithdraw} ${toWithdraw === 1 ? 'token' : 'tokens'}** has been withdrawn from **${mention.username}**'s account which now has a total of **${tokens} ${tokens === 1 ? 'token' : 'tokens'}**`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
    message.delete()
  }
}

module.exports = withdraw
