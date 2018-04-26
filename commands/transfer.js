class transfer {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!transfer', usage: '<Mention> <Amount>', description: 'Give tokens to someone.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let toGive = parseInt(message.content.split(' ')[2])
    if (isNaN(toGive) || toGive < 1) { toGive = 1 }

    let mention = message.mentions.users.array()[0]
    if (!mention) { return }
    if (mention.id === message.author.id) { return }

    let mytokens = this.thot.get('tokens', message.author.id)
    let theirtokens = this.thot.get('tokens', mention.id)
    if (isNaN(mytokens)) { mytokens = 0 }
    if (isNaN(theirtokens)) { theirtokens = 0 }

    if (toGive < 1) { return }

    if (mytokens < toGive) { message.channel.send(`**${message.author.username}**, you don't have that many tokens.`); message.delete(); return }

    let verifyMsg = await this.thot.send(message.channel, {
      title: 'Transfer tokens',
      description: `**${message.author.username}**, are you sure you want to transfer **${toGive} ${toGive === 1 ? 'token' : 'tokens'}** to **${mention.username}**`,
      color: 431075
    })

    verifyMsg.react('✅')
    verifyMsg.react('❌')

    message.delete()

    const onReact = (reaction, user) => {
      if (user.id !== message.author.id) { return }

      if (reaction.emoji.toString() === '❌') { verifyMsg.delete(); this.thot.client.removeListener('messageReactionAdd', onReact); return }
      if (reaction.emoji.toString() === '✅') {
        mytokens -= toGive
        theirtokens += toGive

        this.thot.set('tokens', message.author.id, mytokens)
        this.thot.set('tokens', mention.id, theirtokens)

        this.thot.emit('TRANSACTION', -toGive, message.author.tag, message.guild.id, 'v!transfer')
        this.thot.emit('TRANSACTION', toGive, mention.tag, message.guild.id, 'v!transfer')

        this.thot.send(message.channel, {
          title: 'Transfer Tokens',
          description: `**${message.author.username}** has successfully transferred **${toGive} ${toGive === 1 ? 'token' : 'tokens'}** to <@${mention.id}>`,
          color: 53380
        })
        verifyMsg.delete()
        this.thot.client.removeListener('messageReactionAdd', onReact)
      }
    }

    this.thot.client.on('messageReactionAdd', onReact)
  }
}

module.exports = transfer
