class shop {
  constructor (thot) {
    this.thot = thot
    this.pages = [
      `:game_die: **15 tokens**
  1. (Light green) Shopper role
  2. Choose 1 role with a color of the rainbow
:money_mouth: **25 tokens**
  1. Custom role for 1 week
  2. Perms to talk in #___________________ for 1 week
:gem: **35 tokens**
  1. Submit 3 emotes to use in this server [LIMITED]
  2. Pay me 35 tokens for an extra giveaway with a random prize`,

      `:medal: **50 tokens**
  1. Custom role for 1 week
  2. Increase chance of winning **ONE** giveaway by 1. (1 bot user enters the giveaway as well as you. If the bot user wins, the prize is given to you. You can choose one giveaway to increase your chances on.) [LIMITED]
:trophy: **75 tokens**
  1. 3 extra giveaways with random prizes
  2. Holiday role (role changes color and name depending on the holiday)
:100: **100 tokens**
  1. Custom role
  2. Server shoutout (No mention)
:loudspeaker: **150 tokens**
  1. Access to the #donor-giveaways`,

      `:gift_heart: **200 tokens**
  1. 50% Discount on all items that cost less than 35 tokens
  2. 10% Discount on all items that cost less than 50 tokens
:balloon: **300 tokens**
  1. **3x leftover multiplier**. The amount of tokens you have AFTER buying this will be multiplied by 3. 
:free: **450 tokens**
  1. All things below 35 tokens are free (Will remain free until you leave the server.)
  2. **STEAL!** Get revenge (or just steal for fun)! You can steal from 3 people. The victims will lose all their tokens, you will gain the tokens you have stolen.
:shopping_cart: **600 tokens**
  1. No tax forever. Tax begone!`,

      `:shopping_bags: **750 tokens**
  1. **STEAL!** Get revenge (or just steal for fun)! You can steal from 6 people. The victims will lose all their tokens, you will gain the tokens you have stolen.
:white_check_mark: **1,000 tokens**
  1. **Reverse tax.** Every month I give the amount I should tax to you. Ex.: You get given 100 instead of taxed 100.
  2. I'll give you 5,000 tokens and you have to bet 5,000. If you win/gain, you can keep the tokens I gave you. If you lose, I take the 5,000 back. (And you lose the 1,000 you used to buy this.)
  3. Custom channel [LIMITED]
:confetti_ball: **1,500 tokens**
  1. Get 1 more coin than the current richest person. If you are the richest, you get 1 coin...
  2. Random Steam key [LIMITED]
:slot_machine: **3,000 tokens**
  1. :slot_machine: Play the slot machine! I'll pull up a random number generator that generates numbers every second. You tell me when to stop. The number the generator has will be given to you as tokens. (5 digit generator, #s 0-9)
  2. Buyno tax for lifefor 3 people (other than you). The 600 poem no tax can only be applied to you.`,

      `:scroll: **5,000 tokens**
  1. **Your will.** If you leave the server/get kicked or banned, all your tokens get transferred to one person you choose. **YOU MUST TELL ME when you are going to leave the server/right before you leave.**
  2. Trial moderator perms.
:earth_americas: **8,000 tokens**
  1. Shoutout posted in my larger server (above 20k members), mention 100+ people.
:tada: **10,000 tokens**
  ~~1. Cash out: cash out a selected # of tokens you have as real money, via Paypal.~~
  2. To be determined...`
    ]

    this.thot.register({ command: 'v!shop', usage: '', description: 'Get a list of all the shop items.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let currentPage = 0
    let shopMsg = await message.channel.send(`**Shop:**\n${this.pages[0]}\n\n*Page ${currentPage + 1} / ${this.pages.length}*`)

    await shopMsg.react('◀')
    await shopMsg.react('▶')
    await shopMsg.react('❌')

    message.delete()

    const onReact = (reaction, user) => {
      if (user.id !== message.author.id) { return }
      if (reaction.message.id !== shopMsg.id) { return }

      clearInterval(timeout)

      if (reaction.emoji.toString() === '❌') {
        shopMsg.delete()
        this.thot.client.removeListener('messageReactionAdd', onReact)
        this.thot.client.removeListener('messageReactionRemove', onReact)
        return
      }

      timeout = setTimeout(() => {
        shopMsg.delete()
        this.thot.client.removeListener('messageReactionAdd', onReact)
        this.thot.client.removeListener('messageReactionRemove', onReact)
      }, 60 * 1000)

      if (reaction.emoji.toString() === '◀') {
        if (currentPage - 1 > -1) {
          currentPage--
        } else {
          return
        }
        shopMsg.edit(`**Shop:**\n${this.pages[currentPage]}\n\n*Page ${currentPage + 1} / ${this.pages.length}*`)
      }

      if (reaction.emoji.toString() === '▶') {
        if (currentPage + 1 < this.pages.length) {
          currentPage++
        } else {
          return
        }
        shopMsg.edit(`**Shop:**\n${this.pages[currentPage]}\n\n*Page ${currentPage + 1} / ${this.pages.length}*`)
      }
    }

    let timeout = setTimeout(() => {
      shopMsg.delete()
      this.thot.client.removeListener('messageReactionAdd', onReact)
      this.thot.client.removeListener('messageReactionRemove', onReact)
    }, 60 * 1000)

    this.thot.client.on('messageReactionAdd', onReact)
    this.thot.client.on('messageReactionRemove', onReact)
  }
}

module.exports = shop
