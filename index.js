const THOT = require('./thot.js')

const Discord = require('discord.js')
const token = process.argv[2]

const thot = new THOT(new Discord.Client(), token)
