require('dotenv').config()

import Client from './bot'
import {Player} from 'discord-player'
import {execute} from './commands/play'

const client = new Client()
client.login(process.env.token)
const player = new Player(client)
client.once('ready', () => {
  console.log('Pai ta Pronto')
})
client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName == 'play') {
      execute(interaction, player)
    }
  }
})
