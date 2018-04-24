class definelevel {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!definelevel', usage: '<Minimum Score> <Role Name>', description: 'Define a role for reaching a certain amount of points.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (!this.thot.checkPerms(message)) { return }

    let minScore = parseInt(message.content.split(' ')[1])
    if (isNaN(minScore) || minScore < 0) { return }

    let roleName = message.content.split(' ').splice(2).join(' ')
    if (!roleName || roleName === '') { return }

    let role = message.guild.roles.find('name', roleName)
    if (!role) {
      this.thot.send(message.channel, {
        title: 'Define Level',
        description: `I couldn't find the role \`${roleName}\`, check the spelling and try again.`,
        color: 15347007,
        footer: {
          text: `Executed by ${message.author.username}`
        }
      })
      return
    }

    let levels = this.thot.get('levels', message.guild.id)
    if (!levels.length) { levels = [] }
    levels.push({ score: minScore, role: role.id })
    this.thot.set('levels', message.guild.id, levels)

    this.thot.send(message.channel, {
      title: 'Define Level',
      description: `**${roleName}** has been defined with a minimum score of **${minScore}** :ok_hand:`,
      color: 431075,
      footer: {
        text: `Executed by ${message.author.username}`
      }
    })
    message.delete()
  }
}

module.exports = definelevel
