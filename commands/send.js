class collecttax {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!send', usage: '', description: 'Send a message in chat.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }
    message.channel.send(message.content.split(' ').slice(1).join(' '))
    message.delete()
  }
}

module.exports = collecttax
