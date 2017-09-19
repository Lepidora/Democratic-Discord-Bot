
/*
 * Client routes
 */

const config = require('./config.json');
const general = require('./client/general.js');
const messages = require('./client/messages.js');

module.exports = function(client) {
	
	client.on('ready', general.clientReady(client, config));
	client.on('guildCreate', general.clientJoin(client, config));
	client.on('guildDelete', general.clientLeave(client, config));
	client.on('message', messages(client, config));
}

