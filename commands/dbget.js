class dbget {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!dbget', usage: '<Table> <Key>', description: 'Debug command, get a value from the database.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (this.thot.checkPerms(message) !== 1) { return }

    let table = message.content.split(' ')[1]
    let key = message.content.split(' ')[2]
    if (!table || !key) { return }

    let data = this.thot.get(table, key)

    message.channel.send(`db.${table}.${key}:\`\`\`JSON\n${JSON.stringify(data, null, 2)}\n\`\`\``)
    message.delete()
  }
}

module.exports = dbget
