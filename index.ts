require('dotenv').config()

import Client from './src/bot'

const client = new Client();
client.login(process.env.TOKEN);
client.once('ready', () =>{
    console.log('Pai ta Pronto')
})
client.on('messageCreate', message =>{
})
console.log(process.env.TOKEN)