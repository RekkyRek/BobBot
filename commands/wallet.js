class ping {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: '!wallet', usage: 'Shows how much you have in your wallet.', callback: this.handle.bind(this) })
  }

  async handle (message) {
    let poems = this.thot.get('poems', message.author.id)
    if (isNaN(poems)) { poems = 0; this.thot.set('poems', message.author.id, poems) }

    message.channel.send(`**${message.author.username}**, you have **${poems} ${poems === 1 ? 'poem' : 'poems'}**`)
  }
}

module.exports = ping
