class wallet {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!wallet', usage: '', description: 'Shows how much you have in your wallet.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let id = message.author.id
    let name = message.author.username
    if (message.mentions.users.array()[0]) {
      id = message.mentions.users.array()[0].id
      name = message.mentions.users.array()[0].username
    }

    let poems = this.thot.get('poems', id)
    if (isNaN(poems)) { poems = 0; this.thot.set('poems', message.author.id, poems) }

    message.channel.send()
    this.thot.send(message.channel, {
      title: `${name}'s account:`,
      description: `**${name}** has **${poems} ${poems === 1 ? 'poem' : 'poems'}**`,
      color: 431075
    })
  }
}

module.exports = wallet
