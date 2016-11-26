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
