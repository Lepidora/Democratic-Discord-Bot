/**
 * Message handling module
 */

//Data persistance
const state = loadJSON('state.json');

//Help text
const commands = require('./commands.json');
const helptext = generateHelptext();

//Voting
const voting = require('./voting.js');

module.exports = function(client, config) {
	return message => {
		
		//Prevent self-replies and replies to other bots
		if (message.author.bot) {
			return;
		}
		
		console.log(message.content);
		
		//Check the message starts with the prefix in the config
		if (message.content.indexOf(config.prefix) !== 0) {
			return;
		}
		
		//Split the message into a command and arguments
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		//const id = message.id;
		
		//Handle the help command
		if (command === 'help') {
			
			//If the help request was in a channel, delete it to keep clarity
			if (message.channel.type === 'text') {
				message.delete().catch(error => console.log(`${error} on ${message.channel.guild.name} upon deleting message`));
			}
			
			//Output the help text
			message.author.send(helptext);
		}
		
		//Handle the kick command
		if (command === 'kick') {
			var votesRequired = Math.ceil((message.guild.memberCount + 1) / 2);
			//var votesRequired = 2;
			var duration = config.defaultduration; //86400000 by default (24 hours)
			var guild = message.guild;
			var member = message.mentions.members.first();
			
			//This gets called when the vote finishes
			var outcome = function(passed) {
				if (passed) {
					//Kick the member and handle success and failure
					member.kick().then((member) => {
						message.channel.send(`The people of the server have voted to kick ${member.displayName}`);
					}).catch((error) => {
						console.log(`Unable to kick ${member.displayName}. Error: ${error}`);
						message.channel.send(`Unable to kick ${member.displayName}`);
					});		
				} else {
					message.channel.send(`The people of the server have not voted to kick ${member.displayName}`);
				}
			}
			
			//Delete the original message to avoid clutter
			message.delete().catch(error => console.log(`${error} on ${message.channel.guild.name} upon deleting message`));
			
			//Make an announcement and add the vote to the registry
			var announcement = `The people of the server have started a vote to kick ${member.displayName}. Votes needed to pass: ${votesRequired}\nReact with ${config.yesvote} or ${config.novote} to vote`;
			message.channel.send(announcement).then(message => {				
				voting.startVote(message.id, votesRequired, duration, outcome);
			});
		}
	};
}

function generateHelptext() {
	
	var reply = 'Available Commands:\n\n';
	
	for (var commandname in commands) {
		if (commands.hasOwnProperty(commandname)) {
			
			var commandinfo = commands[commandname];
			
			reply += commandname + ':\n';
			reply += 'Usage: ' + commandinfo.usage + '\n';
			reply += 'Description: ' + commandinfo.description + '\n\n';
		}
	}
	
	return reply;
}

function loadJSON(name) {
	
	var fs = require('fs');
	
	if (!fs.existsSync(name)) {
		fs.writeFileSync('./client/' + name, '{}', 'utf8');
	}
	
	return require('./' + name);
}