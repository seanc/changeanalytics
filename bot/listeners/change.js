const Change = require('../../models/change')

function change(bot, config) {
  bot.on('guildMemberUpdate', (oldUser, newUser) => {
    if (!newUser.nickname) return
    if (oldUser.nickname === newUser.nickname) return
    if (oldUser.bot || newUser.bot) return

    Change.save({
      user: newUser.id,
      guild: newUser.guild.id,
      nickname: newUser.nickname,
      username: newUser.user.username,
      from: oldUser.user.username
    }).then(change => {
      console.log(`User ${change.username} changed nickname from ${change.from} to ${change.nickname}`)
    })
  })
}

module.exports = change
