/**
 * tests
 */
var access = require('..');

var admin = {id: 1, name: 'yarco', roles: ['admin']};
var bloger = {id: 2, name: 'bloger abc', roles: ['blog']};
var user = {id: 3, name: 'normal user', roles: ['user']};
var anonymous = {id: 0, name: 'anonymous', roles: ['guest']};

var resource = {id:10001, type:'unknown', owner: {id: 1}};
var resource_a = {id:10002, type:'blog', owner: {id: 3}};
var resource_b = {id:10003, type:'news', owner: {id:1}};

var rules = [
	{type: 'blog', permissions: {}},
	{type: 'news', permissions: {everyone: 'read'}}
];

describe('Access', function() {
	access.id = 'id';
	access.rules = rules;

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
		it('should ok when user is an admin', function() {
			access.checkUser('delete', admin, resource).should.be.ok;
			access.checkUser('write', admin, resource).should.be.ok;
			access.checkUser('read', admin, resource).should.be.ok;
			access.checkUser('delete', admin, resource_a).should.be.ok;
			access.checkUser('write', admin, resource_a).should.be.ok;
			access.checkUser('read', admin, resource_a).should.be.ok;
			access.checkUser('delete', admin, resource_b).should.be.ok;
			access.checkUser('write', admin, resource_b).should.be.ok;
			access.checkUser('read', admin, resource_b).should.be.ok;
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
	});
});


