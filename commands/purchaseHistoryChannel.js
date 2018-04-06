class purchaseHistoryChannel {
  constructor (thot) {
    this.thot = thot
    this.channel = this.thot.get('serverData', 'purchaseHistoryChannel')

    this.thot.register({ command: 'v!setpurchasehistory', usage: '', description: 'Set the channel where purchase history should be logged.', callback: this.setrole.bind(this), admin: true })
  }

  setrole (message) {
    if (!message.guild) { return }
    if (!this.thot.checkPerms(message)) { return }

    this.channel[message.guild.id] = message.channel.id
    this.thot.set('serverData', 'purchaseHistoryChannel', this.channel)
    this.thot.emit('PHC_UPDATE', this.channel)
    message.react('✅')
    setTimeout(() => message.delete(), 3500)
  }
}

module.exports = purchaseHistoryChannel
