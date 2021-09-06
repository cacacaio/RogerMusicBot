import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'

import { EmbedMessage } from '../helpers/embedMessage'
import { Player } from 'discord-player'
import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Pula uma musica'),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    const queue = player.getQueue(interaction.guildId)
    if (!queue) await EmbedMessage('Não existe musica para skipar', interaction)
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel &&
      interaction.member.voice.channelId ==
        interaction.guild?.me?.voice.channelId
    ) {
      queue.skip()
      const currentSong = queue.current
      const embed = new MessageEmbed()
        .setThumbnail(interaction.member.user.avatarURL()!)
        .setTitle(currentSong.title)
        .setColor('RANDOM')
        .setImage(currentSong.thumbnail)
        .setThumbnail(currentSong.requestedBy.avatarURL()!)
        .addField('🎶🎶Agora Tocando🎶🎶', '\u200B')
      await interaction.followUp({ embeds: [embed] })
    } else {
      await EmbedMessage('Voce não está no meu canal', interaction)
    }
  }
}
