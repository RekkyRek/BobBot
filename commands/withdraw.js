class withdraw {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!withdraw', usage: '<Mention> <Amount>', description: 'Take poems away from someone.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    let toWithdraw = parseInt(message.content.split(' ')[2])
    if (isNaN(toWithdraw)) { toWithdraw = 1 }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    let poems = this.thot.get('poems', mention.id)
    if (isNaN(poems)) { poems = 0 }

    poems -= toWithdraw

    this.thot.set('poems', mention.id, poems)
    this.thot.emit('TRANSACTION', -toWithdraw, mention.tag, message.guild.id, '!withdraw')

    message.channel.send(`**${toWithdraw} ${toWithdraw === 1 ? 'poem' : 'poems'}** has been withdrawn from **${message.author.username}**'s account which now has a total of **${poems} ${poems === 1 ? 'poem' : 'poems'}**`)
    message.delete()
  }
}

module.exports = withdraw
