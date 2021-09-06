import {
  MessageEmbed,
  MessageOptions,
  TextChannel,
  VoiceChannel
} from 'discord.js'
import { Player, Queue, Track } from 'discord-player'

import { EmbedMessage } from './embedMessage'

interface QueueChannel {
  channel: VoiceChannel
  textChannel: TextChannel
}
export default (player: Player) => {
  player.on('trackStart', async (queue: Queue, track: Track) => {
    const embed = EmbedMessage(`🎶🎶 Agora tocando ${track.title} 🎶🎶`)
    const message = await channelExtractor(queue, { embeds: [embed] })
    setTimeout(() => message.delete(), 10000)
  })

  player.on('error', async (queue: Queue, error: Error) => {
    const embed = EmbedMessage(
      `Erro ao tocar ${queue.nowPlaying().title}, pulando para próxima`
    )
    queue.skip()
    await channelExtractor(queue, { embeds: [embed] })
    console.log(`Error at ${queue.guild.name} | ${error}`)
  })
}

const channelExtractor = (queue: Queue, message: MessageOptions | string) => {
  return (queue.metadata as QueueChannel).textChannel.send(message)
}
