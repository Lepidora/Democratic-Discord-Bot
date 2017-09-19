
/*
 * General Discord actions
 */

exports.clientReady = (client, config) => {
	return () => {
		
		var suffix = "";
		
		if (client.guilds.size === 1) {
			suffix = "server";
		} else {
			suffix = "servers";
		}
		
		console.log(`Started on ${client.guilds.size} ${suffix}`);
			
		if (config && config.game) {
			client.user.setGame(config.game);			
		}
	};
}

exports.clientJoin = (client, config) => {
	return guild => {
		console.log(`Joined server ${guild.name}`);
	};
}

exports.clientLeave = (client, config) => {
	return guild => {
		console.log(`Left server ${guild.name}`);
	};
}