import {CommandInteraction, GuildMember, Message, MessageEmbed} from 'discord.js'

import {EmbedMessage} from '../helpers/embedMessage'
import {Player} from 'discord-player'
import {SlashCommandBuilder} from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder().setName('clear').setDescription('Limpa a playlist'),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channelId == interaction.guild?.me?.voice.channelId
    ) {
      const queue = player.getQueue(interaction.guildId)
      if (!queue) return EmbedMessage('Nenhuma musica está tocando', interaction)
      return
    } else {
      EmbedMessage('Voce não está no meu canal', interaction, 'RED')
    }
  },
}
