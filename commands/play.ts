import { BaseCommandInteraction, CommandInteraction, GuildMember } from 'discord.js'
import { Player, QueryType } from 'discord-player'

import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

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

      try {
        if (!queue.connection) await queue.connect(channel)
      } catch (err) {
        console.log(err)
        await interaction.followUp('Não consegui entrar no canal')
        queue.destroy()
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
      track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0])
      if (!queue.playing) await queue.play()
      await interaction.editReply(`Tocando a musica **${track.tracks[0].source}**`)
    } else {
      await interaction.editReply('Voce não está em um canal!')
    }
  },
}
