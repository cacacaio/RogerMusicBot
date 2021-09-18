import {CommandInteraction, GuildMember, MessageEmbed} from 'discord.js'

import {EmbedMessage} from '../helpers/embedMessage'
import {Player} from 'discord-player'
import {SlashCommandBuilder} from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Da um shuffle na playlist'),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    const queue = player.getQueue(interaction.guildId)
    if (!queue)
      await EmbedMessage({
        message: 'Não existe playlist para dar shuffle',
        interaction,
      })
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel &&
      interaction.member.voice.channelId ==
        interaction.guild?.me?.voice.channelId
    ) {
      queue.shuffle()
      const currentSong = queue.current
      await EmbedMessage({
        message: 'Dando shuffle na playlist',
        interaction,
      })
    } else {
      await EmbedMessage({
        message: 'Voce não está no meu canal',
        interaction,
        color: 'RED',
      })
    }
  },
}
