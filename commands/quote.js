const Discord = require('discord.js')
const humanize = require('humanize')

class quote {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!q', usage: '<Message ID>', description: 'Quote a message.', callback: this.handle.bind(this), admin: false })
  }

  handle (message) {
    const id = message.content.split(' ')[1]
    if (!id) { message.delete(); return }
    message.channel.fetchMessage(id)
      .then(qMess => {
        let embed = new Discord.RichEmbed({
          author: {
            name: qMess.author.username,
            icon: qMess.author.avatarURL
          },
          description: qMess.content,
          footer: {
            text: `Sent at ${humanize.date('Y-m-d h:m:s', new Date(qMess.createdAt))}`
          }
        })
        console.log(embed)
        message.channel.send(embed)
        message.delete()
      })
      .catch(() => {
        message.delete()
      })
  }
}

module.exports = quote
