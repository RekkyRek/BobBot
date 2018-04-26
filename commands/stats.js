class collecttax {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!currency', usage: '', description: 'Shows some stats on the currency.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let tokens = this.thot.storage.tokens
    if (!tokens) { return }

    let totaltokens = 0

    Object.keys(tokens).forEach(key => {
      totaltokens += !isNaN(parseInt(tokens[key])) ? parseInt(tokens[key]) : 0
    })

    let avgtokens = parseInt(totaltokens / Object.keys(tokens).length)
    let mediantokens = tokens[Object.keys(tokens)[parseInt(Object.keys(tokens).length / 2)]]

    this.thot.send(message.channel, {
      title: `Currecny Stats`,
      description: `Total: **${totaltokens} tokens**\nAverage: **${avgtokens} tokens**\nMedian: **${mediantokens} tokens**`,
      color: 431075
    })
    message.delete()
  }
}

module.exports = collecttax
