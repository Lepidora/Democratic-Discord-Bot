
/*
 * Client routes
 */

const config = require('./config.json');
const messages = require('./messages.js');

module.exports = function(client) {
	
	client.on('ready', clientReady(client));
	client.on('guildCreate', clientJoin(client));
	client.on('guildDelete', clientLeave(client));
	client.on('message', messages(client, config));
}

function clientReady(client) {
	return () => {
		console.log(`Started on ${client.guilds.size} servers`);
		
		if (config.game) {
			client.user.setGame(config.game);			
		}
	};
}

function clientJoin(client) {
	return guild => {
		console.log(`Joined server ${guild.name}`);
	};
}

function clientLeave(client) {
	return guild => {
		console.log(`Left server ${guild.name}`);
	};
}