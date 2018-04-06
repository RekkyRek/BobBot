const Discord = require('discord.js')

class help {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!help', usage: '', description: '**H E L P**', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let helpStr = ''

    let isMod = this.thot.checkPerms(message)

    Object.keys(this.thot.commands).forEach(key => {
      if (!this.thot.commands[key].admin || isMod) {
        helpStr += `**${key} ${this.thot.commands[key].usage}** | ${this.thot.commands[key].description}\n`
      }
    })

    let embed = new Discord.RichEmbed({
      title: 'Available Commands:',
      description: helpStr,
      color: 15347007
    })

    message.channel.send(embed)
    message.delete()
  }
}

module.exports = help
