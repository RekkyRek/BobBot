class roles {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!roles', usage: '<Table> <Key>', description: 'Debug command, get a value from the database.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (this.thot.checkPerms(message) !== 1) { return }

    let roles = message.guild.roles
    let str = ''
    roles.forEach(role => {
      str += `${role.name} - ${role.id}\n`
    })

    str = str.match(/.{1,1500}/g)
    str.forEach(st => message.channel.send(st))
    // message.channel.send(str)
  }
}

module.exports = roles
