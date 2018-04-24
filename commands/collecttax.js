class collecttax {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!collecttax', usage: '', description: 'Collects the taxes from everyone.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }
    let poems = this.thot.storage.poems
    if (!poems) { return }

    let totalTaxed = 0

    await Object.keys(poems).forEach(async key => {
      if (isNaN(parseInt(poems[key]))) { return }
      if (message.guild.members.get(key)) {
        if (message.guild.members.get(key).roles.find('name', 'TAX-FREE')) {
          return
        }
      } else {
        let member = await message.guild.fetchMember(key)
        if (member) {
          if (member.roles.find('name', 'TAX-FREE')) {
            return
          }
        }
      }

      let tax = 0
      if (poems[key] > 50) { tax = 5 }
      if (poems[key] > 100) { tax = 10 }
      if (poems[key] > 300) { tax = 20 }
      if (poems[key] > 500) { tax = 50 }
      if (poems[key] > 1000) { tax = 100 }
      if (poems[key] > 2000) { tax = 200 }
      if (poems[key] > 5000) { tax = 300 }
      if (poems[key] > 10000) { tax = 500 }
      if (poems[key] > 15000) { tax = 1000 }

      totalTaxed += tax

      this.thot.set('poems', key, poems[key] - tax)
    })

    this.thot.send(message.channel, {
      title: `Tax`,
      description: `**${totalTaxed} coins** have been successfully been taxed.`,
      color: 431075
    })
    message.delete()
  }
}

module.exports = collecttax
