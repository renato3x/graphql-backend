const knex = require('../../config/db')

module.exports = {
  async profiles() {
    return await knex('profiles').select();
  },
  async profile(_, { filters }) {
    return await knex.select('*').from('profiles').where(filters).first();
  }
}