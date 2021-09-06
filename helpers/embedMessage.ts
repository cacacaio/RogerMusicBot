import {
  ColorResolvable,
  CommandInteraction,
  Message,
  MessageEmbed,
} from 'discord.js'

import {APIMessage} from 'discord-api-types'

type embedMsg = {
  message: string
  interaction?: CommandInteraction
  color?: ColorResolvable
}

function EmbedMessage(message: string): MessageEmbed
function EmbedMessage(options: embedMsg): Promise<Message | APIMessage>
function EmbedMessage(options: embedMsg | string) {
  let {message, interaction, color} = options as embedMsg
  if (typeof options == 'string') message = options
  const embed = new MessageEmbed()
    .setDescription(message)
    .setColor(color || 'RANDOM')
  if (!interaction) {
    return embed
  }
  return interaction.followUp({embeds: [embed]})
}

export {EmbedMessage}
