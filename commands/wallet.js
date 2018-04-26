class wallet {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!wallet', usage: '', description: 'Shows how much you have in your wallet.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let id = message.author.id
    let name = message.author.username
    if (message.mentions.users.array()[0]) {
      id = message.mentions.users.array()[0].id
      name = message.mentions.users.array()[0].username
    }

    let tokens = this.thot.get('tokens', id)
    if (isNaN(tokens)) { tokens = 0; this.thot.set('tokens', message.author.id, tokens) }

    this.thot.send(message.channel, {
      title: `${name}'s account:`,
      description: `**${name}** has **${tokens} ${tokens === 1 ? 'token' : 'tokens'}**`,
      color: 431075
    })
  }
}

module.exports = wallet
