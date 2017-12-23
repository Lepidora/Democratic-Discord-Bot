
/*
 * Client routes
 */

const config = require('./config.json');
const general = require('./client/general.js');
const messages = require('./client/messages.js');
const voting = require('./client/voting.js');

module.exports = function(client) {
	
	client.on('ready', general.clientReady(client, config));
	client.on('guildCreate', general.clientJoin(client, config));
	client.on('guildDelete', general.clientLeave(client, config));
	client.on('message', messages(client, config));
	client.on('messageReactionAdd', voting.onReaction(client, config));
	client.on('messageReactionRemove', voting.onReactionRemove(client, config));
}

