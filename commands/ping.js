class ping {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!ping', usage: '', description: 'Get the current latency of the Discord API', callback: this.handle.bind(this), admin: false })
  }

  async handle (message, messageRecieved) {
    let proTime = new Date() - messageRecieved
    let apiTime = new Date()

    const pingMessage = await message.channel.send('🏓')

    pingMessage.edit(`**${(new Date() - apiTime) / 2}ms** API (A2R) Latency\n**${proTime}ms** Processing Latency`)
  }
}

module.exports = ping
