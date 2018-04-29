class level {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!level', usage: '', description: '', callback: this.handle.bind(this), admin: false })
  }

  async handle (m) {
    let guild = this.thot.client.guilds.get(m.guild.id)

    let tatsumirror = this.thot.get('tatsumakiMirror', guild.id)

    let id = m.author.id
    let name = m.author.username

    if (m.mentions.users.array()[0]) {
      name = m.mentions.users.array()[0].username
      id = m.mentions.users.array()[0].id
    }

    let isMe = name === m.author.username

    let userScore = tatsumirror[id].score
    let level = this.thot.get('levels', id)
    if (isNaN(level)) { level = 0; this.thot.set('levels', id, 0) }

    let progress = (userScore - (level * 250)) / 250
    let progressbar = '[                    ]'

    if (progress >= 0.1) progressbar = '[=                           ]'
    if (progress >= 0.2) progressbar = '[==                        ]'
    if (progress >= 0.3) progressbar = '[===                     ]'
    if (progress >= 0.4) progressbar = '[====                  ]'
    if (progress >= 0.5) progressbar = '[=====               ]'
    if (progress >= 0.6) progressbar = '[======            ]'
    if (progress >= 0.7) progressbar = '[=======         ]'
    if (progress >= 0.8) progressbar = '[========      ]'
    if (progress >= 0.9) progressbar = '[=========   ]'
    if (progress >= 1.0) progressbar = '[==========]'

    this.thot.send(m.channel, {
      title: `${isMe ? 'Your' : name + '\'s'} Level`,
      description: `${isMe ? 'Your are' : name + ' is'} currently **Level ${level}**\n\n__Level Progress__\n${progressbar} ${(userScore - (level * 250))}/250xp`,
      color: 431075,
      footer: {
        text: `Executed by ${m.author.username}`
      }
    })
  }
}

module.exports = level
