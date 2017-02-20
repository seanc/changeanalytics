// const Change = require('../../models/change')
const textTable = require('text-table')
const r = require('../../lib/database')
const Promise = require('bluebird')
const Duration = require('duration')

function stats(bot, config) {
  return function run(message, args) {
    if (!message.guild) return

    const start = new Date()

    message.reply('Retrieving Data...').then(message => {
      const total = r.table('change')
        .filter({guild: message.guild.id})

      const top = total.group('username', { multi: true })
        .count()
        .ungroup()
        .orderBy(r.desc('reduction'))
        .limit(10)
        .run()

      const lastHour = total.filter(row => {
        return row('createdAt').gt(r.now().sub(3600))
      }).count().run()

      const lastDay = total.filter(row => {
        return row('createdAt').gt(r.now().sub(86400))
      }).count().run()

      Promise.all([lastHour, lastDay, total, top]).then(changes => {
        message.delete()
        const now = new Date()
        const duration = new Duration(start, now)
        const [hour, day, totals, tops] = changes
        if (!totals.length) return message.channel.sendMessage('No analytics have been collected for this guild yet.')
        message.channel.sendEmbed({
          title: `Username change analytics for ${message.guild.name}`,
          fields: [
            {
              name: 'Last Hour',
              value: hour,
              inline: true
            },
            {
              name: 'Last Day',
              value: day,
              inline: true
            },
            {
              name: 'Total',
              value: totals.length,
              inline: true
            },
            {
              name: 'Top users',
              value: ((changes) => {
                const topTen = changes.map(change => {
                  return [`[${change.group}]`, change.reduction]
                })
                console.log(topTen)
                const table = textTable(topTen, { hsep: ' : ' })
                return '```css\n' + table + '\n```'
              })(tops)
            }
          ],
          footer: {
            text: duration.toString('Took %M minute(s) %S second(s) %Lsms')
          }
        })
      }).catch(console.log)
    })

  }
}

stats.command = 'stats'

module.exports = stats
