import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import { Embed, SlashCommandBuilder } from '@discordjs/builders'
import { Player, QueryType } from 'discord-player'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca musica')
    .addStringOption((option) =>
      option.setName('song').setRequired(true).setDescription('Nome da musica'),
    ),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return

    const url = interaction.options.getString('song', true)

    if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
      const channel = interaction.member.voice.channel

      const queue = player.createQueue(interaction.guild!, {
        metadata: { channel: channel },
      })

      if (!queue.connection) {
        await queue.connect(channel).catch(async (err) => {
          await interaction.followUp('Não consegui entrar no canal')
          console.error('Destroyed Connection on Join Error')
          queue.destroy()
        })
      }

      const track = await player
        .search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch((err) => {
          console.log(err)
          interaction.followUp({ content: 'Erro ao buscar musica', ephemeral: true })
        })

      if (!track || !track.tracks.length) return interaction.followUp('Não consegui achar a musica')
      const currentTrack = track.tracks[0]
      track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0])

      if (!queue.playing) await queue.play()
      const embed = new MessageEmbed()
        .setTitle(currentTrack.title)
        .addField('🎶🎶Adicionada a Playlist🎶🎶', '\u200B')
        .setURL(currentTrack.url)
        .setImage(currentTrack.thumbnail)
        .setColor('RANDOM')
        .setThumbnail(interaction.member.user.avatarURL()!)
        .setAuthor(
          currentTrack.author,
          '',
          `https://youtube.com/${encodeURIComponent(currentTrack.author)}`,
        )

      await interaction.followUp({ embeds: [embed] })
    } else {
      await interaction.editReply('Voce não está em um canal!')
    }
  },
}
