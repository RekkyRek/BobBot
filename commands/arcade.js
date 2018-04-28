class ping {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!arcade', usage: '', description: 'Play snake, get tokens.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message, messageRecieved) {
    message.channel.send('Not implmented yet')
  }
}

module.exports = ping
