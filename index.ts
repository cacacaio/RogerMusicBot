import 'dotenv/config'

import {Client, Intents} from 'discord.js'

import {Commands} from './bot'
import Player from './bot'
import {deploy} from './helpers/deployCommands'
import events from './helpers/events'
import fs from 'fs'

const client = new Client({
  intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
})
const player = new Player(client)
const commandFiles = fs
  .readdirSync(process.env.COMMAND_FOLDER!)
  .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))

for (const file of commandFiles) {
  const command: Commands = require(`./commands/${file}`)
  player.commands.set(command.data.name, command)
}
client.login(process.env.TOKEN)
client.once('ready', () => {
  console.log('Pai ta Pronto')
})
events(player)
client.on('messageCreate', (message) => {
  if (message.content == '!deploy' && message.guild) {
    deploy(
      [...player.commands.values()].map((c) => c.data),
      message.guild.id
    )
  }
})
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return
  await interaction.deferReply()
  const command = player.commands.get(interaction.commandName)
  command?.execute(interaction, player)
})
