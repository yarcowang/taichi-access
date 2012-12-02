/**
 * @file taichi-access.js
 * simple access control system following *nix style
 *
 * @author yarco <yarco.wang@gmail.com>
 * @since 2012/10/25
 */
/* vim: set tabstop=2 shiftwidth=2 softtabstop=2 noexpandtab ai si: */

var debug = require('debug')('taichi:access');
var _ = require('underscore');

module.exports = new Access;

function Access() {}

(function() {
	this.id = '_id';
	this.rules = {};
	this.user = {};

	/** set access rules {{{*/
	this.setRules = function(rules) {
		var self = this;
		_(rules).each(function(rule) {
			self.rules[rule.type] = rule.permissions;
		});
		debug('rules: %j', this.rules);
	};/*}}}*/

	/** common version of check permission {{{
	 *
	 * NOTICE: default role names "guest, user, admin" shouldn't be used in resource type name
	 *
	 * @param string one of 'read', 'write', 'delete'
	 * @param object user object, must have two fields: id(defined by this._id), roles. role "guest", "user", "admin" are reserved
	 * @param object normal resource object, must have two fields: type, owner. type "users", "system" are reserved
	 * @return boolean
	 */
	this.checkUser = function(permission, user, resource) {
		var ref = this.id, u, r;

		user = _.extend((u = {name: 'anonymous', roles: ['guest']}, u[ref] = 0, u), user);
		resource = _.extend((r = {type: 'system', owner: {}}, r[ref] = 0, r.owner[ref] = -1, r), resource);
		debug('permission: %s user: %j resource: %j', permission, user, resource);

		// check owner:
		// owner: always have the permission for read/write/delete the resource
		// speical resource: users, only for user table(or similar), it is different from the role name 'user'
		if ((resource.owner && resource.owner[ref] === user[ref]) || (resource.type === 'users' && resource[ref] === user[ref])) {
			return true;
		}
		// special resource: system
		if (resource.type === 'system') {
			if (permission === 'read' || // system resource is always read to everyone
				user.roles.indexOf('admin') !== -1) { // admin always has full rights to system resource
				return true;
			}
		}

		var rule,i,j,t;

		i = 0;
		rule = this.rules[resource.type] || null;
		j = permission === 'delete' ? 10 : (permission === 'write' ? 5 : 1);

		// check everyone
		if (rule && rule.everyone) {
			i = rule.everyone === 'delete' ? 10 : (rule.everyone === 'write' ? 5 : 1);
		}

		// check if user is admin
		if (user.roles.indexOf('admin') !== -1) {
			t = rule && rule.admin ?
				(rule.admin === 'delete' ? 10 : (rule.admin === 'write' ? 5 : 1)) : 10;
			i = i > t ? i : t;
		}

		// user is in the same group as resource type
		if (user.roles.indexOf(resource.type) !== -1) {
			t = rule && rule[resource.type] ?
				(rule[resource.type] === 'delete' ? 10 : (rule[resource.type] === 'write' ? 5 : 1)) : 5;
			i = i > t ? i : t;
		}

		// normal user role
		if (user.roles.indexOf('user') !== -1) {
			t = rule && rule.user ?
				(rule.user === 'delete' ? 10 : (rule.user === 'write' ? 5 : 1)) : 1;
			i = i > t ? i : t;
		}

		debug('i,j (%d,%d)', i, j);

		return i >= j;
	};/*}}}*/

	/** check this.user has the permisssion on resource {{{
	 *
	 * @param string one of 'read', 'write', 'delete'
	 * @param object resource object, must have two fields: type, owner
	 * @return boolean
	 * @see checkUser
	 */
	this.check = function(permission, resource) {
		return this.checkUser(permission, this.user, resource);
	};/*}}}*/

	/** utility function, http method map to permission definition {{{
	 *
	 * @param string http method, should be one of 'GET', 'POST', 'PUT', 'DELETE', others are all mapping to `read`
	 * @return string one of 'read', 'write', 'delete'
	 */
	this.http2perm = function(method) {
		var m = method.toLowerCase();
		return (m === 'delete' || m === 'put') ? 'delete' : (m === 'post' ? 'write' : 'read');
	};/*}}}*/

}).call(Access.prototype);

