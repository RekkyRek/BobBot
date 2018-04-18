class collecttax {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!currency', usage: '', description: 'Shows some stats on the currency.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let poems = this.thot.storage.poems
    if (!poems) { return }

    let totalCoins = 0

    Object.keys(poems).forEach(key => {
      totalCoins += !isNaN(parseInt(poems[key])) ? parseInt(poems[key]) : 0
    })

    let avgCoins = totalCoins / Object.keys(poems).length
    let medianCoins = poems[parseInt(Object.keys(poems).length / 2)]

    this.thot.send(message.channel, {
      title: `Currecny Stats`,
      description: `Total: **${totalCoins} coins**\nAverage: **${avgCoins} coins**\nMedian: **${medianCoins} coins**`,
      color: 431075
    })
    message.delete()
  }
}

module.exports = collecttax
