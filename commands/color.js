const Discord = require('discord.js')

const teirs = [
  {
    level: 10,
    colors: [
      'Red',
      'Orange',
      'Marigold',
      'Harlequin'
    ]
  },
  {
    level: 25,
    colors: [
      'Cyan',
      'Navy Blue',
      'Purple',
      'Neon Pink'
    ]
  },
  {
    level: 50,
    colors: [
      'Brick',
      'Gold',
      'Light Green',
      'Aquamarine',
      'Lilac',
      'Vivid Green',
      'Candy Pink',
      'Candy Purple'
    ]
  },
  {
    level: 75,
    colors: [
      'Light Crimson',
      'Amber',
      'Peridot',
      'Teal',
      'Magenta',
      'Violet',
      'Salmon'
    ]
  },
  {
    level: 100,
    colors: [
      'Royal Garnet',
      'Wine',
      'Tech Blue',
      'Lemon',
      'Emerald',
      'Jade',
      'Soft Green',
      'Grape'
    ]
  },
  {
    level: 150,
    colors: [
      'Light Yellow',
      'Light Emerald',
      'Cream',
      'Soda',
      'Light Blue',
      'Pastel Blue',
      'Electric Purple'
    ]
  },
  {
    level: 200,
    colors: [
      'Crimson',
      'Aqua Green',
      'Turquoise',
      'Pink'
    ]
  },
  {
    level: 300,
    colors: [
      'Lime',
      'Blue',
      'Indigo',
      'Peach',
      'Ice',
      'Soft Purple',
      'Chocolate'
    ]
  },
  {
    level: 400,
    colors: [
      'Light Soda',
      'Light Turquoise',
      'Light Magenta',
      'Dark Aqua Green',
      'Hot Pink',
      'Bubblegum',
      'Night'
    ]
  }
]

class color {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!color', usage: '<Color Number>', description: 'Let\'s you select a role color.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    if (message.content.split(' ').length === 1) {
      const embed = new Discord.RichEmbed()
      embed.setTitle('Color Selection')
      embed.setDescription('Usage: **b!color *Color Name***\nFor a list of colors, check <#438792303075786763>')
      embed.setColor(431075)
      message.channel.send('', embed)
    } else {
      let findRole = message.content.split(' ').slice(1).join(' ').toLowerCase()

      let lvl = this.thot.get('levels', message.author.id)
      if (isNaN(lvl)) { lvl = 0; this.thot.set('levels', message.author.id, 0) }

      if (this.thot.checkPerms(message) >= 1) { lvl = 9999999 }

      let isAllowed = false
      let allowedColors = []
      let allColors = []

      if (lvl) {
        await teirs.forEach(async teir => {
          await teir.colors.forEach(async color => {
            allColors.push(await message.guild.roles.find('name', color))
          })
          if (teir.level <= lvl) {
            allowedColors = [...allowedColors, ...(teir.colors)]
          }
        })

        isAllowed = allowedColors.find(color => color.toLowerCase() === findRole)
      }

      if (findRole === 'clear') {
        await message.member.removeRoles(allColors)
        message.react('439143886431191051')
        return
      }
      if (isAllowed) {
        await message.member.removeRoles(allColors)
        await message.member.addRole(message.guild.roles.find('name', isAllowed))
        message.react('439143886431191051')
      } else {
        const embed = new Discord.RichEmbed()
        embed.setTitle('Color Selection')
        embed.setDescription('You haven\'t unlocked that color yet, check <#438792303075786763> for a list of colors.')
        embed.setColor(15406156)
        message.channel.send('', embed)
      }
    }
  }
}

module.exports = color
