class applyreferee {
  constructor (thot) {
    this.thot = thot

    this.thot.on('LONG_PULSE', this.handle.bind(this))
    this.thot.register({ command: 'b!applyreferee', usage: '', description: '', callback: (message) => { this.handle(message.guild.id, message) }, admin: true })
  }

  async handle (guildid, m) {
    if (m && this.thot.checkPerms(m) !== 1) { return }

    let guild = this.thot.client.guilds.get(guildid)
    let invites = await guild.fetchInvites()

    let refereeRole = this.thot.get('roles', guild.id)['referee']
    let hasReferee = this.thot.get('referees', guild.id)

    let appliedTo = 0

    await invites.forEach(async invite => {
      if (invite.uses >= 5 && !hasReferee[invite.inviter.id]) {
        try {
          let user = await guild.fetchMember(invite.inviter.id)
          if (user) {
            user.addRole(refereeRole)
            appliedTo++
            hasReferee[invite.inviter.id] = true
          } else {
            hasReferee[invite.inviter.id] = true
          }
        } catch (e) {

        }
      }
    })

    if (appliedTo > 0) {
      console.log(`applied referee role to ${appliedTo} members`)
    }
  }
}

module.exports = applyreferee
