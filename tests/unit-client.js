/*
 * Unit test for the client module
 */

const expect = require('chai').expect;
const sinon = require('sinon');

const general = require('../src/client/general.js');

describe('clientReady console output', clientReadyOutput);
describe('clientReady game setting', clientReadyGame);
describe('clientJoin console output', clientJoinOutput);
describe('clientLeave console output', clientLeaveOutput);

function clientReadyOutput() {
	
	var systemLog = console.log;
	
	beforeEach(() => {
		sinon.stub(console, 'log');
	});
	
	afterEach(() => {
		console.log = systemLog;
	});
	
	it('should output the correct word when there are 0 servers', () => {
		
		var testclient = {guilds: {size: 0}};
		
		general.clientReady(testclient)();
		
		expect(console.log.calledOnce).to.be.true;
		expect(console.log.calledWith('Started on 0 servers'));
	});
	
	it('should output the correct word when there is 1 server', () => {
		
		var testclient = {guilds: {size: 1}};
		
		general.clientReady(testclient)();
		
		expect(console.log.calledOnce).to.be.true;
		expect(console.log.calledWith('Started on 1 server'));
	});
	
	it('should output the correct word when there are 5 servers', () => {
		
		var testclient = {guilds: {size: 5}};
		
		general.clientReady(testclient)();
		
		expect(console.log.calledOnce).to.be.true;
		expect(console.log.calledWith('Started on 5 servers'));
	});
}

function clientReadyGame() {
	
	it('should set the game when the config is set', () => {
		
		var name = 'Test Name';
		
		var config = {game: name};
		var testclient = {guilds: {size: 5}, user: {}};
		
		var testgame;
		
		testclient.user.setGame = game => {
			testgame = game;
		};
		
		general.clientReady(testclient, config)();
		
		expect(testgame).to.equal(name);
	});
	
	it('shouldn\'t set the game when the config isn\'t set', () => {
		
		var config = {};
		var testclient = {guilds: {size: 5}, user: {}};
		
		var returngame;
		
		testclient.user.setGame = game => {
			returngame = game;
		};
		
		general.clientReady(testclient, config)();
		
		expect(returngame).to.equal(undefined);
	});
}

function clientJoinOutput() {
	
	var systemLog = console.log;
	
	beforeEach(() => {
		sinon.stub(console, 'log');
	});
	
	afterEach(() => {
		console.log = systemLog;
	});
	
	it('should output the correct server name', () => {
		
		var name = 'Test Name';
		
		var testserver = {name: name};
		
		general.clientJoin()(testserver);
		
		expect(console.log.calledOnce).to.be.true;
		expect(console.log.calledWith('Joined server Test Name'));
	});
}

function clientLeaveOutput() {
	
	var systemLog = console.log;
	
	beforeEach(() => {
		sinon.stub(console, 'log');
	});
	
	afterEach(() => {
		console.log = systemLog;
	});
	
	it('should output the correct server name', () => {
		
		var name = 'Test Name';
		
		var testserver = {name: name};
		
		general.clientLeave()(testserver);
		
		expect(console.log.calledOnce).to.be.true;
		expect(console.log.calledWith('Left server Test Name'));
	});
}