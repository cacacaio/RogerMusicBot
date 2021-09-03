import {ColorResolvable, CommandInteraction, Message, MessageEmbed} from 'discord.js'

import {APIMessage} from 'discord-api-types'

export const EmbedMessage = (
  message: string,
  interaction: CommandInteraction,
  color?: ColorResolvable
) => {
  const embed = new MessageEmbed().setDescription(message).setColor(color || 'RANDOM')
  if (!interaction) return embed
  return interaction.followUp({embeds: [embed]})
}
