class ping {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: '!ping', usage: 'Get the current latency of the Discord API', callback: this.handle.bind(this) })
  }

  async handle (message, messageRecieved) {
    if (!this.thot.checkPerms(message)) { return }

    let apiTime = new Date()
    let proTime = new Date() - messageRecieved

    const pingMessage = await message.channel.send('🏓')

    pingMessage.edit(`**${new Date() - apiTime}ms** API Latency\n**${proTime}ms** Processing Latency`)
    message.delete()
  }
}

module.exports = ping
