import {CommandInteraction, GuildMember, MessageEmbed} from 'discord.js'

import {Player} from 'discord-player'
import {SlashCommandBuilder} from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Mostra musica tocando no momento'),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    const queue = player.getQueue(interaction.guildId)
    if (!queue) return await interaction.followUp('Nenhuma musica está tocando')
    if (interaction.member instanceof GuildMember) {
      const currentTrack = queue.nowPlaying()
      console.log(queue.tracks)
      const embed = new MessageEmbed()
        .setTitle(currentTrack.title)
        .addField('🎶🎶Tocando Agora🎶🎶', '\u200B')
        .setURL(currentTrack.url)
        .setImage(currentTrack.thumbnail)
        .setColor('RANDOM')
        .setThumbnail(interaction.member.user.avatarURL()!)
        .setAuthor(
          currentTrack.author,
          '',
          `https://youtube.com/${encodeURIComponent(currentTrack.author)}`
        )
      await interaction.followUp({embeds: [embed]})
      setTimeout(() => interaction.deleteReply(), 20000)
    }
  },
}
