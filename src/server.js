
/**
 * Module dependencies
 */

const Discord = require('discord.js');
const routes = require('./client.js');

const auth = require('./auth.json');

/**
 * Server setup
 */

const client = new Discord.Client();
routes(client);

client.login(auth.token);