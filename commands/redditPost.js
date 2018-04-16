class redditPost {
  constructor (thot) {
    this.thot = thot
    this.post = this.thot.get('redditPost', 'id')

    this.thot.register({ command: 'v!setredditpost', usage: '<Post ID>', description: 'Set the Reddit post used for verification.', callback: this.setpost.bind(this), admin: true })
  }

  setpost (message) {
    if (!message.guild) { return }
    if (!this.thot.checkPerms(message)) { return }

    let postID = message.content.split(' ')[1]

    if (postID) {
      this.post = postID
      this.thot.set('redditPost', 'id', this.post)
      this.thot.emit('REDDIT_POST_UPDATE', this.post)
      message.react('✅')
    } else {
      message.react('❌')
    }
  }
}

module.exports = redditPost
