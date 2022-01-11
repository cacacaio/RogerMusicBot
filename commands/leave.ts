import {CommandInteraction, GuildMember, MessageEmbed} from 'discord.js'

import {Player} from 'discord-player'
import {SlashCommandBuilder} from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Sai do canal e deleteta a queue'),
  execute: async (interaction: CommandInteraction, player: Player) => {
    if (!interaction.guildId) return
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channelId ==
        interaction.guild?.me?.voice.channelId
    ) {
      const queue = player.getQueue(interaction.guildId)
      if(queue){
        queue.destroy(true)
      const embed = new MessageEmbed()
        .setDescription('Saindo do canal e deletando playlist')
        .setColor('RED')
      interaction.followUp({embeds: [embed]})
      }
    } else {
      interaction.followUp({
        content: 'Voce não está no meu canal!',
        ephemeral: true,
      })
    }
  },
}
