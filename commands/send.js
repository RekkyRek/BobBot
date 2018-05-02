class send {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!send', usage: '', description: 'Send a message in chat.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (this.thot.checkPerms(message) !== 1) { return }
    message.channel.send(message.content.split(' ').slice(1).join(' '))
  }
}

module.exports = send
