const knex = require('../../config/db');

module.exports = {
  async users(profile) {
    return await knex('users')
      .join('users_profiles', 'users_profiles.userId', 'users.id')
      .where('users_profiles.profileId', profile.id);
  }
}