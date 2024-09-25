const knex = require('../../config/db')

module.exports = {
  async profiles(user) {
    return await knex('profiles')
      .join('users_profiles', 'users_profiles.profileId', 'profiles.id')
      .where('users_profiles.userId', user.id);
  },
  createdAt(user) {
    return user.createdAt.toString();
  }
}