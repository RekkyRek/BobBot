const Snoowrap = require('snoowrap')

class redditVerify {
  constructor (thot) {
    this.thot = thot
    this.roles = this.thot.get('serverData', 'roles')
    this.postid = this.thot.get('redditPost', 'id')
    this.verified = this.thot.get('verifiedUsers', 'users')
    this.r = new Snoowrap(require('../data/redditAuth.json'))

    this.thot.on('REDDIT_ROLE_UPDATE', (roles) => { this.roles = roles })
    this.thot.on('REDDIT_POST_UPDATE', (postid) => { this.postid = postid })
    this.thot.on('GLOBAL_PULSE', this.checkPost.bind(this))
  }

  async checkPost () {
    const post = await this.r.getSubmission(this.postid)
    await post.comments.forEach(async (comment) => {
      if (!this.verified[comment.author.name] && comment.body.split(' ')[0] === 'verify') {
        let tag = comment.body.match(/[0-9]*/g)

        if (!tag) { return }

        tag = tag.join('')

        if (!isNaN(parseInt(tag))) {
          let didSet = false
          await Object.keys(this.roles).forEach(async key => {
            try {
              const member = await this.thot.client.guilds.get(key).fetchMember(tag)
              if (member) {
                didSet = true
                member.addRole(this.roles[key])
                this.verified[comment.author.name] = member.id
                this.thot.set('verifiedUsers', 'users', this.verified)
              }
            } catch (e) {}
          })

          if (didSet) { comment.reply('You have now been verified.') }
        }
      }
    })
  }
}

module.exports = redditVerify
