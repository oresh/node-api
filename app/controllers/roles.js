/*
 * @TODO
 * Add permission table width permission for existing roles
 * add method for controllers to let add own permissions to table
 * add method to check if user has permission
 * add method for changing permission for a certain role ?
 * or find a special roles nodejs plugin :)
 */
var roleController = {
	roles: ['anon', 'authenticated', 'editor', 'administrator'],
	defaultRole: 'authenticated',
	getRoles: function() {
		return this.roles;
	},
	getDefault: function() {
		return this.defaultRole;
	}
}

module.exports = roleController;
