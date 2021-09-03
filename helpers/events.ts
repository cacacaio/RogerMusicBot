import {Player, Queue, Track} from 'discord-player'
import {TextChannel, VoiceChannel} from 'discord.js'

interface QueueChannel {
  channel: VoiceChannel
  textChannel: TextChannel
}
export default (player: Player) => {
  player.on('trackStart', async (queue: Queue, track: Track) => {
    const textChannel = (queue.metadata as QueueChannel).textChannel
    const message = await textChannel.send(`🎶🎶 Agora tocando ${track.title} 🎶🎶`)
    setTimeout(() => message.delete(), 10000)
  })
}
