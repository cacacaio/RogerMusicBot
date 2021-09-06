import {
  ColorResolvable,
  CommandInteraction,
  Message,
  MessageEmbed
} from 'discord.js'

import { APIMessage } from 'discord-api-types'

function EmbedMessage(message: string): MessageEmbed
function EmbedMessage(
  message: string,
  interaction?: CommandInteraction,
  color?: ColorResolvable
): Promise<Message | APIMessage>
function EmbedMessage(
  message: string,
  interaction?: CommandInteraction,
  color?: ColorResolvable
) {
  const embed = new MessageEmbed()
    .setDescription(message)
    .setColor(color || 'RANDOM')
  if (!interaction) {
    return embed
  }
  return interaction.followUp({ embeds: [embed] })
}

export { EmbedMessage }
