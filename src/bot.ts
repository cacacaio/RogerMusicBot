import {Client, Intents} from 'discord.js'

export default class extends Client{
    queue: Map<String, any>
    constructor(){
        super({
            intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
        })
        this.queue = new Map();
    }
}