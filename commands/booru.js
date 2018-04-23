const https = require('https')
const xml2json = require('xml2js').parseString
const { URL } = require('url')
const Discord = require('discord.js')

class booru {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!booru', usage: '<Tags>', description: 'Interactive booru browser.', callback: this.handle.bind(this), admin: false })
  }

  search (msg, c) {
    let tags = msg.content.toLowerCase().split(' ').splice(1)
    if (tags.length > 2) {
      this.thot.send(msg, {
        title: 'Booru Error',
        description: 'A maximum of 2 tags allowed due to API restrictions.',
        color: 10027247
      })
      c([])
      return
    }
    if (tags.length === 0) {
      this.thot.send(msg, {
        title: 'Booru Error',
        description: `No tags provided.\nUsage: **v!booru <Tags>**`,
        color: 10027247
      })
      c([])
      return
    }

    if (typeof (tags) === 'object') { tags = tags.join(' ') }
    tags += ' -rating:safe'

    const options = new URL(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=${tags}&limit=100&pid=0`)

    https.get(options, (res) => {
      var body = ''

      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', async () => {
        let response
        await xml2json(body, (e, result) => { response = result })

        if (response['posts']['$']['count'] === '0') {
          this.thot.send(msg, {
            title: 'Booru Error',
            description: `No results found for **${tags}**`,
            color: 10027247
          })
          c([])
          return
        }

        c(response['posts']['post'])
      })
    })
  }

  async handleBooru (message) {
    if (message.channel.nsfw === false) {
      this.thot.send(message.channel, {
        title: 'NSFW',
        description: 'This command can only be used in channels marked as NSFW.'
      })
      return
    }
    this.search(message, (res) => {
      if (res.length === 0) { return }
      console.log(res)
      const image = res[Math.floor(Math.random() * res.length)]

      console.log(image)

      let desc = ''
      if (image['$'].source !== '') { desc += `**Source:** ${image['$'].source}\n` }
      if (image['$'].tags !== '') { desc += `**Tags:** ${image['$'].tags.replace(/\s+/g, ' ').trim()}\n` }

      const embed = new Discord.RichEmbed({
        title: 'Booru',
        description: desc,
        color: 10027247,
        url: image['$'].source.split(' ')[0]
      })
      embed.setImage(image['$'].file_url)
      message.channel.send(embed)
    })
  }
}

module.exports = booru
