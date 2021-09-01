import { BaseCommandInteraction, CommandInteraction, GuildMember } from 'discord.js'
import { Player, QueryType } from 'discord-player'

import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder().setName('play').setDescription('Tocar uma Musica'),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    await interaction.deferReply()
    const url = interaction.options.getString('song', true)
    if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
      const channel = interaction.member.voice.channel
      const queue = player.createQueue(interaction.guild!, { metadata: { channel: channel } })

      try {
        if (!queue.connection) await queue.connect(channel)
      } catch (err) {
        console.log(err)
        interaction.followUp('Não consegui entrar no canal')
        queue.destroy()
      }
      const song = await player
        .search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch((err) => console.log(err))
      if (!song || !song.tracks.length) return interaction.followUp('Não consegui achar a musica')
      song.playlist ? queue.addTracks(song.tracks) : queue.addTrack(song.tracks[0])
      if (!queue.playing) await queue.play()
    } else {
      await interaction.editReply('Voce não está em um canal!')
    }
  },
}
