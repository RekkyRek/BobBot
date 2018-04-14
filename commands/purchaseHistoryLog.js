class purchaseHistoryChannel {
  constructor (thot) {
    this.thot = thot
    this.channel = this.thot.get('serverData', 'purchaseHistoryChannel')

    this.thot.on('PHC_UPDATE', (channel) => { this.channel = channel })
    this.thot.on('TRANSACTION', this.handle.bind(this))
  }

  handle (amount, user, guildID, reason) {
    const channel = this.channel[guildID]
    console.log(channel, amount, user, guildID, reason)
    if (!channel) { return }

    this.thot.client.guilds.get(guildID).channels.get(channel)
      .send(`${user} | ${amount} ${amount === 1 ? 'coin' : 'coins'} | ${reason}`)
  }
}

module.exports = purchaseHistoryChannel
