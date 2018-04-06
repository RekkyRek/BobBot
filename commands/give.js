class give {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!give', usage: '<Mention> <Amount>', description: 'Give poems to someone.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    let toGive = parseInt(message.content.split(' ')[2])
    if (isNaN(toGive) || toGive < 1) { toGive = 1 }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }

    let poems = this.thot.get('poems', mention.id)
    if (isNaN(poems)) { poems = 0 }

    poems += toGive

    this.thot.set('poems', mention.id, poems)
    this.thot.emit('TRANSACTION', toGive, mention.tag, message.guild.id, 'admin give')

    this.thot.send(message.channel, {
      title: 'Give Poems',
      description: `**${mention.username}** has been awarded **${toGive} ${toGive === 1 ? 'poem' : 'poems'}** for a total of **${poems} ${poems === 1 ? 'poem' : 'poems'}**`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
    message.delete()
  }
}

module.exports = give
