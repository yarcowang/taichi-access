/**
 * tests
 */
var access = require('..');

var admin = {id: 1, type:'users', name: 'yarco', roles: ['admin']};
var bloger = {id: 2, type:'users', name: 'bloger abc', roles: ['blog']};
var user = {id: 3, type:'users', name: 'normal user', roles: ['user']};
var anonymous = {id: 0, type:'users', name: 'anonymous', roles: ['guest']};

var resource = {id:10001, type:'unknown', owner: {id: 1}};
var resource_a = {id:10002, type:'blog', owner: {id: 3}};
var resource_b = {id:10003, type:'news', owner: {id:1}};
var resource_s = {id:10004}; // no type, no owner, system resource

var rules = [
	{type: 'blog', permissions: {}},
	{type: 'news', permissions: {everyone: 'read'}}
];

describe('Access', function() {
	access.id = 'id';
	access.setRules(rules);

	describe('id', function() {
		it('should return id after you set id to id', function() {
			access.id.should.equal('id');
		});
	});

	describe('rules', function() {
		it('should return an object with several properties', function() {
			access.rules.should.have.property('news');
			access.rules.news.should.have.property('everyone');
		});
	});

	describe('checkUser', function() {
		it('should have full permission when user is an admin', function() {
			access.checkUser('delete', admin, resource).should.be.ok;
			access.checkUser('write', admin, resource).should.be.ok;
			access.checkUser('read', admin, resource).should.be.ok;
			access.checkUser('delete', admin, resource_a).should.be.ok;
			access.checkUser('write', admin, resource_a).should.be.ok;
			access.checkUser('read', admin, resource_a).should.be.ok;
			access.checkUser('delete', admin, resource_b).should.be.ok;
			access.checkUser('write', admin, resource_b).should.be.ok;
			access.checkUser('read', admin, resource_b).should.be.ok;
			access.checkUser('delete', admin, resource_s).should.be.ok;
			access.checkUser('write', admin, resource_s).should.be.ok;
			access.checkUser('read', admin, resource_s).should.be.ok;
		});

		it('should not ok when user is not admin', function() {
			access.checkUser('read', bloger, resource).should.be.false;
			access.checkUser('write', user, resource).should.be.false;
			access.checkUser('read', anonymous, resource).should.be.false;
		});

		it('bloger should have write/read permission on blog resource', function() {
			access.checkUser('delete', bloger, resource_a).should.not.be.ok;
			access.checkUser('write', bloger, resource_a).should.be.ok;
			access.checkUser('read', bloger, resource_a).should.be.ok;
		});

		it('owner should have full permission on owner resource', function() {
			access.checkUser('delete', user, resource_a).should.be.ok;
			access.checkUser('write', user, resource_a).should.be.ok;
			access.checkUser('read', user, resource_a).should.be.ok;
		});

		it('anonymous should have read permission if permission everyone read is set', function() {
			access.checkUser('read', anonymous, resource_a).should.not.be.ok;
			access.checkUser('read', anonymous, resource_b).should.be.ok;
		});

		it('user should have read permission on all resource', function() {
			access.checkUser('read', user, resource).should.be.ok;
			access.checkUser('read', user, resource_a).should.be.ok;
			access.checkUser('read', user, resource_b).should.be.ok;
		});

		it('should on when user modify his profile, not ok when modify others', function() {
			access.checkUser('write', user, user).should.be.ok;
			access.checkUser('write', user, bloger).should.not.be.ok;
		});

		it('should ok when everyone want to read system resource and not ok to write', function() {
			access.checkUser('read', anonymous, resource_s).should.be.ok;
			access.checkUser('write', anonymous, resource_s).should.not.be.ok;
		});
	});
});


