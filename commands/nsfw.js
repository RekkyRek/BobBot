class nsfw {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!nsfw', usage: '', description: 'Give yourself access to #nsfw.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    if (message.member.roles.get('435399590213058578')) {
      message.member.removeRole('435399590213058578')
    } else {
      message.member.addRole('435399590213058578')
    }

    message.react('439143886431191051')
  }
}

module.exports = nsfw
