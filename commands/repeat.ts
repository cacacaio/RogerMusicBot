import {CommandInteraction, GuildMember, MessageEmbed} from 'discord.js'

import {EmbedMessage} from '../helpers/embedMessage'
import {Player, Queue, QueueRepeatMode} from 'discord-player'
import {SlashCommandBuilder} from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Repete uma musica infinitamente')
    .addBooleanOption((option) =>
      option
        .setName('ligado')
        .setDescription('Liga ou desliga o modo loop')
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    const queue = player.getQueue(interaction.guildId)
    if (!queue)
      await EmbedMessage({
        message: 'Não existe musica para repetir',
        interaction,
      })
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel &&
      interaction.member.voice.channelId ==
        interaction.guild?.me?.voice.channelId
    ) {
      const enabled = interaction.options.getBoolean('ligado', true)
      queue.setRepeatMode(enabled ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF)
      const msg = enabled
        ? '🎶🎶Entrando no modo repeat🎶🎶'
        : '🎶🎶Saindo do modo repeat🎶🎶'
      const currentSong = queue.current
      const embed = new MessageEmbed()
        .setThumbnail(interaction.member.user.avatarURL()!)
        .setTitle(currentSong.title)
        .setColor('RANDOM')
        .setImage(currentSong.thumbnail)
        .setThumbnail(currentSong.requestedBy.avatarURL()!)
        .addField(msg, '\u200B')
      await interaction.followUp({embeds: [embed]})
    } else {
      await EmbedMessage({
        message: 'Voce não está no meu canal',
        interaction,
        color: 'RED',
      })
    }
  },
}
