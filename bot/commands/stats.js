const Change = require('../../models/change')
const textTable = require('text-table')

function stats(bot, config) {
  return function run(message, args) {
    if (!message.guild) return
    Change.filter(row => row('guild').eq(message.guild.id)).then(changes => {
      if (!changes.length) return message.reply('No analytics have been collected for this guild yet.')
      message.channel.sendEmbed({
        title: `Change analytics for ${message.guild.name}`,
        fields: [
          {
            name: 'Last Hour',
            value: changes.filter(change => {
              return (new Date().getTime() - change.createdAt.getTime()) <= 3600000
            }).length,
            inline: true
          },
          {
            name: 'Last Day',
            value: changes.filter(change => {
              return (new Date().getTime() - change.createdAt.getTime()) <= 86400000
            }).length,
            inline: true
          },
          {
            name: 'Total',
            value: changes.length,
            inline: true
          },
          {
            name: 'Top changes',
            value: ((changes) => {
              const mappedChanges = changes.reduce((map, change) => {
                change = change.username
                map[change] = (map[change] || 0) + 1
                return map
              }, {})
              const sortedChanges = Object.keys(mappedChanges).sort((a, b) => {
                return mappedChanges[b] - mappedChanges[a]
              }).slice(0, 10)
              const topTen = sortedChanges.map(change => {
                return [`[${change}]`, changes.filter(c => c.username === change).length]
              })
              const table = textTable(topTen, { hsep: ' : ' })
              return '```css\n' + table + '\n```'
            })(changes)
          }
        ]
      })
    })
  }
}

stats.command = 'stats'

module.exports = stats
