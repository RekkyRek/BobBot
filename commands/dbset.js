class dbset {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!dbset', usage: '<Table> <Key> <Value>', description: 'Debug command, set a value in the database.', callback: this.handle.bind(this), admin: true })
  }

  async handle (message) {
    if (this.thot.checkPerms(message) !== 1) { return }

    let table = message.content.split(' ')[1]
    let key = message.content.split(' ')[2]
    let value = message.content.split(' ').slice(3).join(' ')
    if (!table || !key || !value) { return }

    if (value[0] === '{') { value = JSON.parse(value) }

    this.thot.set(table, key, value)

    message.channel.send(`Successfully set db.${table}.${key} to ${value}`)
    message.delete()
  }
}

module.exports = dbset
