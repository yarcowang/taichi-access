/**
 * @file taichi-access.js
 * simple access control system following *nix style
 *
 * @author yarco <yarco.wang@gmail.com>
 * @date 2012/10/25
 */
/* vim: set tabstop=2 shiftwidth=2 softtabstop=2 noexpandtab ai si: */

var debug = require('debug')('taichi:access');

module.exports = new Access;

function Access() {}

(function() {
	this.id = '_id';
	this.rules = {};
	this.user = {};

	/** \brief set access rules {{{*/
	this.setRules = function(rules) {
		var self = this;
		rules.forEach(function(rule) {
			self.rules[rule.type] = rule.permissions;
		});
		debug('rules: %j', this.rules);
	}
	/*}}}*/

	/** \brief common version of check permission {{{
	 *
	 * NOTICE: default group names "guest, user, admin" shouldn't be used in resource type name
	 *
	 * @param string one of 'read', 'write', 'delete'
	 * @param object user object, must have two fields: id(defined by this._id), roles
	 * @param object resource object, must have two fields: type, owner
	 * @return boolean
	 */
	this.checkUser = function(permission, user, resource) {
		var r = this.id;

		debug('permission: %s user: %j resource: %j', permission, user, resource);

		// check owner: owner always have the permission for read/write/delete the resource
		// speical resource: users only for user table(or similar), it is different from the group name 'user'
		if ((resource.hasOwnProperty('owner') && resource.owner[r] === user[r]) || (resource.type === 'users' && resource[r] === user[r])) {
			return true;
		}
	 
		var rule,i,j,t;

		i = 0;
		rule = this.rules.hasOwnProperty(resource.type) ? this.rules[resource.type] : null;
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
	/*}}}*/

	/** \biref check this.user has the permisssion on resource {{{
	 *
	 * @param string one of 'read', 'write', 'delete'
	 * @param object resource object, must have two fields: type, owner
	 * @return boolean
	 * @see checkUser
	 */
	this.check = function(permission, resource) {
		return this.checkUser(permission, this.user, resource);
	}
	/*}}}*/

	/** \biref return anonymous user for visitor {{{*/
	this.anonymous = function() {
		var user = {};
		user[this.id] = 0;
		user['name'] = 'anonymous';
		user['roles'] = ['guest'];
		return user;
	}
	/*}}}*/

}).call(Access.prototype);

