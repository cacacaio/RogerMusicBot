import { BaseCommandInteraction } from 'discord.js'
import { Interaction } from 'discord.js'
import {SlashCommandBuilder} from '@discordjs/builders'

module.exports = {
   data : new SlashCommandBuilder().setName('play').setDescription('Tocar uma Musica'),
    execute : async (interaction: BaseCommandInteraction): Promise<void> => {
        await interaction.reply('Teste')
    }
}

