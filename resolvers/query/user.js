const knex = require('../../config/db')

module.exports = {
  async users() {
    return await knex
      .select('*')
      .from('users');
  },
  async user(_, { filters }) {
    return await knex('users')
      .select()
      .where(filters)
      .first();
  },
}