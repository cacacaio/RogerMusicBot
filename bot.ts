import {
  BaseCommandInteraction,
  Client,
  Collection,
  CommandInteraction
} from 'discord.js'

import { Player } from 'discord-player'
import { SlashCommandOptionsOnlyBuilder } from '@discordjs/builders'

export interface Commands {
  data: SlashCommandOptionsOnlyBuilder
  execute(interaction: CommandInteraction): void
  execute(interaction: BaseCommandInteraction, player: Player): void
}
export default class extends Player {
  commands: Collection<string, Commands>
  constructor(client: Client) {
    super(client)
    this.commands = new Collection<string, Commands>()
    this.options.ytdlOptions = {
      requestOptions: { headers: { cookie: process.env.COOKIE } }
    }
  }
}
