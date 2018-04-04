class take {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: '!give', usage: '<Mention> <Amount> Give poems to someone.', callback: this.handle.bind(this) })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    let toGive = parseInt(message.content.split(' ')[2])
    if (isNaN(toGive)) { toGive = 1 }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    let poems = this.thot.get('poems', mention.id)
    if (isNaN(poems)) { poems = 0 }

    poems += toGive

    this.thot.set('poems', mention.id, poems)

    message.channel.send(`**${message.author.username}** as been awarded **${toGive} ${toGive === 1 ? 'poem' : 'poems'}** for a total of **${poems} ${poems === 1 ? 'poem' : 'poems'}**`)
    message.delete()
  }
}

module.exports = take
