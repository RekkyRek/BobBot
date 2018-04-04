class redditRole {
  constructor (thot) {
    this.thot = thot
    this.post = this.thot.get('redditPost', 'id')

    this.thot.register({ command: '!setredditpost', usage: '<Post ID> Set the Reddit post used for verification.', callback: this.setpost.bind(this) })
  }

  setpost (message) {
    if (!message.guild) { return }
    if (!this.thot.checkPerms(message)) { return }

    let postID = message.content.split(' ')[1]

    if (postID) {
      this.post[message.guild.id] = postID
      this.thot.set('redditPost', 'id', this.post)
      this.thot.emit('REDDIT_POST_UPDATE', this.post)
      message.react('✅')
    } else {
      message.react('❌')
    }
  }
}

module.exports = redditRole
