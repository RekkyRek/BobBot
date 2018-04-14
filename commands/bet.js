class give {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!bet', usage: '<Mention> <Amount>', description: 'Gamble your coins for a chance to get more.', callback: this.handle.bind(this), admin: false })
  }

  r (a) {
    return a[Math.floor(Math.random() * a.length)]
  }

  async handle (message) {
    let amount = parseInt(message.content.split(' ')[1])
    if (isNaN(amount) || amount < 1) { message.channel.send(`**${message.author.username}**, you need to specify an amount to bet.`); message.delete(); return }

    let poems = this.thot.get('poems', message.author.id)
    if (isNaN(poems)) { poems = 0 }

    if (poems < amount) { message.channel.send(`**${message.author.username}**, you don't have that many coins.`); message.delete(); return }
    if (amount > 25) { message.channel.send(`**${message.author.username}**, you're only allowed to bet up to **25 coins**.`); message.delete(); return }

    poems -= amount
    this.thot.emit('TRANSACTION', -amount, message.author.tag, message.guild.id, 'bet')

    const roll1 = this.r([0, 0, 1, 1, 1, 2])
    const roll2 = this.r([0, 0, 1, 1, 1, 3])

    const win = amount * roll1 * roll2

    poems += win

    this.thot.set('poems', message.author.id, poems)

    if (win > 0) {
      this.thot.emit('TRANSACTION', win, message.author.tag, message.guild.id, 'bet win')
    }

    let color = 11253955

    if (win === 0) { color = 15347007 }
    if (win > amount) { color = 53380 }

    this.thot.send(message.channel, {
      title: `${message.author.username}'s bet`,
      description: `You rolled **${roll1}** and **${roll2}**. You won **${win} ${win === 1 ? 'coin' : 'coins'}**. You now have a total of **${poems} ${poems === 1 ? 'coin' : 'coins'}**`,
      color: color,
      footer: {
        text: `Total Coins = Coins - ${amount} + (${amount} * ${roll1} * ${roll2})[${win}]`
      }
    })

    message.channel.send()
    message.delete()
  }
}

module.exports = give
