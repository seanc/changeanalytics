// const Change = require('../../models/change')
const r = require('../../lib/database')

function change(bot, config) {
  bot.on('guildMemberUpdate', (oldUser, newUser) => {
    if (!newUser.nickname) return
    if (oldUser.nickname === newUser.nickname) return
    if (oldUser.bot || newUser.bot) return

    r.table('change').insert({
      user: newUser.id,
      guild: newUser.guild.id,
      nickname: newUser.nickname,
      username: newUser.user.username,
      from: oldUser.user.username,
      createdAt: r.now()
    }).run().then(change => {
      console.log(`User ${newUser.user.username} changed nickname from ${oldUser.nickname} to ${newUser.nickname}`)
    })
  })
}

module.exports = change
