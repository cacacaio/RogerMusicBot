import {
  CommandInteraction,
  GuildMember,
  InteractionCollector,
  Message,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction
} from 'discord.js'

import { EmbedMessage } from '../helpers/embedMessage'
import { Player } from 'discord-player'
import { SlashCommandBuilder } from '@discordjs/builders'
import { metatadaQueue } from './play'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Mostra a playlist'),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channelId ===
        interaction.guild?.me?.voice.channelId
    ) {
      const queue = player.getQueue<metatadaQueue>(interaction.guildId)
      if (!queue)
        return EmbedMessage('Não tem nenhuma musica tocando', interaction)
      const playListTrack = queue.tracks
        .slice(0, 10)
        .map(
          (t, i) => `${queue.tracks.indexOf(t)} ) ${t.title} - ${t.duration}`
        )

      const embed = EmbedMessage(playListTrack.join('\n'))

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('previous')
          .setLabel('Previous')
          .setStyle('SECONDARY'),
        new MessageButton()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle('SECONDARY')
      )
      const message = (await interaction.followUp({
        embeds: [embed],
        components: [row]
      })) as Message

      const collector = message.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 300000
      })

      collector.on('collect', async (i) => {
        if (i.customId == 'previous') {
          if (typeof queue.metadata?.currentPage == 'number') {
            queue.metadata.currentPage -= 1
            const currentPage = queue.metadata?.currentPage
            const start = currentPage * 10
            console.log(`pagina : ${currentPage}, ${start} - ${start + 10}`)
            const nextPage = queue.tracks
              .slice(start, start + 10)
              .map(
                (t) => `${queue.tracks.indexOf(t)} ) ${t.title} - ${t.duration}`
              )

            await interaction.editReply({
              embeds: [EmbedMessage(nextPage.join('\n'))]
            })
            i.deferUpdate()
          }
        }
        if (i.customId == 'next') {
          if (typeof queue.metadata?.currentPage == 'number') {
            queue.metadata.currentPage += 1
            const currentPage = queue.metadata?.currentPage
            const start = currentPage * 10
            const nextPage = queue.tracks
              .slice(start, start + 10)
              .map(
                (t) => `${queue.tracks.indexOf(t)} ) ${t.title} - ${t.duration}`
              )

            await interaction.editReply({
              embeds: [EmbedMessage(nextPage.join('\n'))]
            })
            i.deferUpdate()
          }
        }
      })
    } else {
      return EmbedMessage('Você não está no mesmo canal que eu', interaction)
    }
  }
}
