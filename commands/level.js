class level {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!level', usage: '', description: '', callback: this.handle.bind(this), admin: false })
  }

  async handle (m) {
    let guild = this.thot.client.guilds.get(m.guild.id)

    let tatsumirror = this.thot.get('tatsumakiMirror', guild.id)

    let userScore = tatsumirror[m.author.id].score
    let level = this.thot.get('levels', m.author.id)
    if (isNaN(level)) { level = 0; this.thot.set('levels', m.author.id, 0) }

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
      title: 'Your Level',
      description: `You are currently **Level ${level}**\n\n__Level Progress__\n${progressbar} ${(userScore - (level * 250))}/250xp`,
      color: 431075,
      footer: {
        text: `Executed by ${m.author.username}`
      }
    })
  }
}

module.exports = level
