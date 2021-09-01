import {REST} from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { SlashCommandOptionsOnlyBuilder } from '@discordjs/builders';

const rest = new REST({version: '9'}).setToken(process.env.TOKEN!);
export const deploy = async (commands: SlashCommandOptionsOnlyBuilder[], guildId: string) => {
	try {
		await rest.put(
			Routes.applicationGuildCommands('882041376680857651', guildId),
			{ body:  commands},
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
}