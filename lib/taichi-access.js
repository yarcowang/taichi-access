/**
 * @file
 * simple access control system following *nix style
 *
 * @author yarco <yco_w@me.com>
 * @date 2012/10/25
 */

/**
 * require
 */
var debug = require('debug')('taichi:access');

/**
 * taichi access class
 */
function Access()
{
	this._id = '_id'; // key attribute for user, used also in resource.owner

	this._r = {}; // access rules 
	this._u = {}; // user
}

// setter & getter
Access.prototype = {
	// id
	get id() {
		return this._id;
	},
	set id(id) {
		this._id = id;
		return this;
	},

	// rules
	get rules() {
		return this._r;
	},
	set rules(rules) {
		var self = this;
		rules.forEach(function(rule) {
			self._r[rule.type] = rule.permissions;
		});
		debug('rules: %j', this._r);
		return this;
	},

	// user
	get user() {
		return this._u;
	},
	set user(user) {
		this._u = user;
		return this;
	}
}

/**
 * common version of check permission
 *
 * NOTICE: default group names "guest, user, admin" shouldn't be used in resource type name
 *
 * @param string one of 'read', 'write', 'delete'
 * @param object user object, must have two fields: id(defined by this._id), roles
 * @param object resource object, must have two fields: type, owner
 * @return boolean
 */
Access.prototype.checkUser = function(permission, user, resource) {
	var r = this._id;

	debug('permission: %s user: %j resource: %j', permission, user, resource);

	// check owner: owner always have the permission for read/write/delete the resource
	if (resource.owner[r] === user[r]) {
		return true;
	}
 
	var rule,i,j,t;

	i = 0;
	rule = this._r.hasOwnProperty(resource.type) ? this._r[resource.type] : null;
	j = permission === 'delete' ? 10 : (permission === 'write' ? 5 : 1);

	// check everyone
	if (rule && rule.hasOwnProperty('everyone')) {
		i = rule.everyone === 'delete' ? 10 : (rule.everyone === 'write' ? 5 : 1);
	}

	// check if user is admin
	if (user.roles.indexOf('admin') !== -1) {
		t = rule && rule.hasOwnProperty('admin') ?
			(rule.admin === 'delete' ? 10 : (rule.admin === 'write' ? 5 : 1)) : 10;
		i = i > t ? i : t;
	}

	// user is in the same group as resource type
	if (user.roles.indexOf(resource.type) !== -1) {
		t = rule && rule.hasOwnProperty(resource.type) ?
			(rule[resource.type] === 'delete' ? 10 : (rule[resource.type] === 'write' ? 5 : 1)) : 5;
		i = i > t ? i : t;
	}

	// normal user role
	if (user.roles.indexOf('user') !== -1) {
		t = rule && rule.hasOwnProperty('user') ?
			(rule.user === 'delete' ? 10 : (rule.user === 'write' ? 5 : 1)) : 1;
		i = i > t ? i : t;
	}

	debug('i,j (%d,%d)', i, j);

	return i >= j;
}

/**
 * check this._u has the permisssion on resource
 *
 * @param string one of 'read', 'write', 'delete'
 * @param object resource object, must have two fields: type, owner
 * @return boolean
 * @see checkUser
 */
Access.prototype.check = function(permission, resource) {
	return this.checkUser(permission, this._u, resource);
}

/**
 * export
 */
exports = module.exports = new Access;
