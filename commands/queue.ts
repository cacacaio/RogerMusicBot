import {
  CommandInteraction,
  GuildMember,
  InteractionCollector,
  Message,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
} from 'discord.js'

import {EmbedMessage} from '../helpers/embedMessage'
import {Player} from 'discord-player'
import {SlashCommandBuilder} from '@discordjs/builders'
import {metatadaQueue} from './play'

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
        return EmbedMessage({
          message: 'Não tem nenhuma musica tocando',
          interaction,
          color: 'RED',
        })
      const playListTrack = queue.tracks
        .slice(0, 10)
        .map(
          (t, i) => `${queue.tracks.indexOf(t)} ) ${t.title} - ${t.duration}`
        )

      const embed = EmbedMessage(playListTrack.join('\n'))

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('first')
          .setLabel('First')
          .setStyle('SECONDARY'),
        new MessageButton()
          .setCustomId('previous')
          .setLabel('Previous')
          .setStyle('SECONDARY'),
        new MessageButton()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle('SECONDARY'),
        new MessageButton()
          .setCustomId('last')
          .setLabel('Last')
          .setStyle('SECONDARY')
      )
      const message = (await interaction.followUp({
        embeds: [embed],
        components: [row],
      })) as Message

      const collector = message.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 300000,
      })

      collector.on('collect', async (i) => {
        if (typeof queue.metadata?.currentPage == 'number') {
          switch (i.customId) {
            case 'previous':
              queue.metadata.currentPage -= 1
              break
            case 'next':
              queue.metadata.currentPage += 1
              break
            case 'first':
              queue.metadata.currentPage = 0
              break
            case 'last':
              queue.metadata.currentPage = (queue.tracks.length - 10) / 10
              break
          }
          const currentPage = queue.metadata?.currentPage,
            start = currentPage * 10

          const nextPage = queue.tracks
            .slice(start, start + 10)
            .map(
              (t) => `${queue.tracks.indexOf(t)} ) ${t.title} - ${t.duration}`
            )
          if (nextPage.length == 0) return i.deferUpdate()
          await interaction.editReply({
            embeds: [EmbedMessage(nextPage.join('\n'))],
          })
          i.deferUpdate()
        }
      })
    } else {
      return EmbedMessage({
        message: 'Você não está no mesmo canal que eu',
        interaction,
        color: 'RED',
      })
    }
  },
}
