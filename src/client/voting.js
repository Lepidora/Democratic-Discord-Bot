/**
 * Vote handling module
 */

const register = {};

//Called when a vote is started
exports.startVote = function(id, required, duration, outcome) {
	
	//Stores the votes required, the vote duration and the outcome, with the comment ID as a key
	register[id] = {
			//Vote parameters
			outcome: outcome,
			required: required,
			duration: duration,
			
			//Vote data
			yes: 0,
			no: 0
		};
	
	//Schedule this code to run after the vote duration
	setTimeout(() => {
		//Calls the outcome with a failure and deletes the vote
		outcome(false);
		delete register[id];
	}, duration);
}

//Called when someone votes yes
exports.voteYes = function(id) {
	
	//Fetch the vote from the registry and increment the yes count
	var vote = register[id];
	
	if (vote) {
		vote.yes++;
		
		console.log(`yes: ${vote.yes}`);
		
		//Check if the vote count is enough to pass
		if (vote.yes >= vote.required) {
			vote.outcome(true);
			delete register[id];
		}
	}
}

//Called when someone votes no
exports.voteNo = function(id) {
	
	//Fetch the vote from the registry and increment the no count
	var vote = register[id];
	
	if (vote) {
		vote.no++;
		
		//Check if the vote count is enough to fail
		if (vote.no >= vote.required) {
			vote.outcome(false);
			delete register[id];
		}
	}
}

//Called when someone retracts a yes vote
exports.removeYes = function(id) {
	
	var vote = register[id];
	
	if (vote) {
		vote.yes--;
		console.log(`unyes: ${vote.yes}`);
	}
}

//Called when someone retracts a no vote
exports.removeNo = function(id) {
	
	var vote = register[id];
	
	if (vote) {
		vote.no--;
	}
}

//Listener for when a message is reacted to
exports.onReaction = function(client, config) {
	return (reaction, user) => {
		
		var message = reaction.message;
		var count = reaction.count;
		var emoji = reaction.emoji;
		console.log(`Reacted: ${emoji.name} Client id: ${client.user.id} Message id: ${message.id}`);
		
		//Check if the message reacted to was made by the bot
		if (client.user.id === message.client.user.id) {
			
			console.log(`Yes vote: ${config.yesvote}`);
			
			if (emoji.name === config.yesvote) {
				console.log('yes');
				exports.voteYes(message.id);
			}
			
			if (emoji.name === config.novote) {
				console.log('no');
				exports.voteNo(message.id);
			}
		}
		
	};
}

//Removing a vote is not supported
exports.onReactionRemove = function(client, config) {
	return (reaction, user) => {
		
		console.log('unreact');
		
		var message = reaction.message;
		var count = reaction.count;
		var emoji = reaction.emoji;
		
		//Check if the message reacted to was made by the bot
		if (client.user.id === message.client.user.id) {
			
			if (emoji.name === config.yesvote) {
				exports.removeYes(message.id);
			}
			
			if (emoji.name === config.novote) {
				exports.removeNo(message.id);
			}
		}
	};
}