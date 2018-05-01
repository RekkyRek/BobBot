class help {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!help', usage: '', description: 'H E L P', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let helpStr = ''

    let isMod = this.thot.checkPerms(message) >= 1

    Object.keys(this.thot.commands).forEach(key => {
      if (!this.thot.commands[key].admin || isMod) {
        helpStr += `**${key} ${this.thot.commands[key].usage}** | ${this.thot.commands[key].description}\n`
      }
    })

    this.thot.send(message.channel, {
      title: 'Available Commands:',
      description: helpStr,
      color: 431075,
      footer: {
        text: isMod ? '*Including mod commands' : ''
      }
    })

    message.delete()
  }
}

module.exports = help
