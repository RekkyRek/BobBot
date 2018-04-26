const Discord = require('discord.js')
const intercept = require('intercept-stdout')

class debug {
  constructor (thot) {
    this.thot = thot

    setTimeout(() => {
      intercept((text) => {
        this.log(text)
        return ''
      })

      console.log('Bot is now ready.')
    }, 1000)

    process.on('uncaughtException', this.exception.bind(this))
  }

  async exception (e) {
    this.thot.client.guilds.forEach(guild => {
      try {
        let channelID = this.thot.get('debugChannels', guild.id)
        if (!guild.channels.get(channelID)) { return }
        const embed = new Discord.RichEmbed()
        embed.setTitle('Uncaught Exception')
        embed.setDescription(e)
        embed.setColor(15406156)
        guild.channels.get(channelID).send('', embed)
      } catch (e) {}
    })
  }

  async log (text) {
    this.thot.client.guilds.forEach(guild => {
      try {
        let channelID = this.thot.get('debugChannels', guild.id)
        if (!guild.channels.get(channelID)) { return }
        const embed = new Discord.RichEmbed()
        embed.setTitle('Debug Log')
        embed.setDescription(text)
        embed.setColor(431075)
        guild.channels.get(channelID).send('', embed)
      } catch (e) {}
    })
  }
}

module.exports = debug
