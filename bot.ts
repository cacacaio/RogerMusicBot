import {BaseCommandInteraction, Client, Collection, CommandInteraction, Intents} from 'discord.js'

import { Player } from 'discord-player';
import { SlashCommandOptionsOnlyBuilder } from '@discordjs/builders';

export type Commands = {
    data : SlashCommandOptionsOnlyBuilder
    execute : (interaction : BaseCommandInteraction) => void
}
export default class extends Player{
    commands : Collection<string, Commands>
    constructor(client: Client){
        super(client)
        this.commands = new Collection<string, Commands>();
    }
}