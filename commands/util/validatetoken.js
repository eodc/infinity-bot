const { Command } = require('discord.js-commando')
const fs = require('fs')
const os = require('os')
const path = require('path')

module.exports = class ValidateTokenCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'validatetoken',
      group: 'util',
      memberName: 'validatetoken',
      aliases: ['valtok', 'validtok'],
      description: 'Crossreferences vote tokens with users file to check if token is valid.',
      args: [
        {
          key: 'token',
          prompt: 'Enter the token(s) you would like to validate, separating each with a space.',
          type: 'string'
        }
      ]
    })
  }
  hasPermission (msg) {
    const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
    for (var i in userList) if (userList[i].id === msg.author.id && userList[i].level === 3) return true
    return this.client.isOwner(msg.author)
  }
  run (msg, args) {
    const adminChannelID = this.client.provider.get(msg.guild.id, 'adminChannel')
    if (msg.channel.id !== adminChannelID) {
      return msg.reply(`you must be in ${msg.guild.channels.get(adminChannelID)} to use this command!`)
    }
    var tokenArray = args.token.split(' ')
    const userList = JSON.parse(fs.readFileSync(path.join(os.homedir(), '/.config/infinity-bot/users.json'), 'utf8', (err, data) => { if (err) console.error(err) }))
    var validTokens = []
    for (var i in tokenArray) {
      for (var g in userList) {
        if (tokenArray[i] === userList[g].token) {
          validTokens.push(`\`${tokenArray[i]}\`: \`valid\``)
          break
        }
        validTokens.push(`\`${tokenArray[i]}\`: \`invalid\``)
      }
    }
    msg.channel.send(validTokens.join('\n'))
  }
}
