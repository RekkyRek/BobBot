const https = require('https')
const xml2json = require('xml2js').parseString
const { URL } = require('url')
const Discord = require('discord.js')

class booru {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'v!booru', usage: '<Tags>', description: 'Interactive booru browser.', callback: this.handleBooru.bind(this), admin: false })
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
    await this.search(message, async (res) => {
      if (res.length === 0) { return }
      console.log(res)
      let currentPage = 0
      const image = res[currentPage]

      const embed = await message.channel.send(image['$'].file_url)

      await embed.react('◀')
      await embed.react('▶')
      await embed.react('❌')

      let timeout = setTimeout(() => {
        embed.delete()
        this.thot.client.removeListener('messageReactionAdd', onReact)
        this.thot.client.removeListener('messageReactionRemove', onReact)
      }, 5 * 60 * 1000)

      const onReact = (reaction, user) => {
        if (user.id !== message.author.id) { return }
        if (reaction.message.id !== embed.id) { return }

        clearInterval(timeout)

        if (reaction.emoji.toString() === '❌') {
          embed.delete()
          this.thot.client.removeListener('messageReactionAdd', onReact)
          this.thot.client.removeListener('messageReactionRemove', onReact)
          return
        }

        timeout = setTimeout(() => {
          embed.delete()
          this.thot.client.removeListener('messageReactionAdd', onReact)
          this.thot.client.removeListener('messageReactionRemove', onReact)
        }, 60 * 1000)

        if (reaction.emoji.toString() === '◀') {
          if (currentPage - 1 > -1) {
            currentPage--
          } else {
            return
          }
          embed.edit(res[currentPage])
        }

        if (reaction.emoji.toString() === '▶') {
          if (currentPage + 1 < res.length) {
            currentPage++
          } else {
            return
          }
          embed.edit(res[currentPage])
        }
      }

      this.thot.client.on('messageReactionAdd', onReact)
      this.thot.client.on('messageReactionRemove', onReact)
    })
  }
}

module.exports = booru
