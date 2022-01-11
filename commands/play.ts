import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  StageChannel,
  TextBasedChannels,
  VoiceChannel,
} from 'discord.js'
import * as playdl from 'play-dl'
import {Player, QueryType} from 'discord-player'

import {EmbedMessage} from '../helpers/embedMessage'
import {SlashCommandBuilder} from '@discordjs/builders'

export type metatadaQueue = {
  channel: VoiceChannel | StageChannel
  textChannel: TextBasedChannels | null
  currentPage: number
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca musica')
    .addStringOption((option) =>
      option.setName('song').setRequired(true).setDescription('Nome da musica')
    ),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId && !interaction.guild) return
    const url = interaction.options.getString('song', true)
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel
    ) {
      const channel = interaction.member.voice.channel
      const track = await player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })

      if (!track || !track.tracks.length) {
        return interaction.followUp('Não consegui achar a musica')
      }

      const queue = player.createQueue<metatadaQueue>(interaction.guild!, {
        metadata: {
          channel: channel,
          textChannel: interaction.channel,
          currentPage: 0,
        },
        async onBeforeCreateStream(track, source, _queue) {
          if (source === 'youtube') {
            await playdl.setToken({youtube: {cookie: (process.env.COOKIE as string)}})
            return (await playdl.stream(track.url)).stream
          }
          return undefined as unknown as Promise<any>
        },
      })

      if (!queue.connection) {
        await queue.connect(channel).catch(async () => {
          await interaction.followUp('Não consegui entrar no canal')
          player.deleteQueue(interaction.guildId!)
        })
      }
      if (
        interaction.member.voice.channelId !=
        interaction.guild?.me?.voice.channelId
      )
        return await interaction.followUp(
          'Voce não está no mesmo canal que eu!'
        )

      const currentTrack = track.tracks[0]
      track.playlist
        ? queue.addTracks(track.tracks)
        : queue.addTrack(track.tracks[0])
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
          `https://youtube.com/${encodeURIComponent(currentTrack.author)}`
        )
      await interaction.followUp({embeds: [embed]})
    } else {
      EmbedMessage({
        message: 'Voce não está em um canal de voz!',
        interaction,
        color: 'RED',
      })
    }
  },
}
