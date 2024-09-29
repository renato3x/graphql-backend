const knex = require('../../config/db')

module.exports = {
  async profiles(_object, _args, ctx) {
    if (ctx) {
      ctx.validateAdmin();
    }

    return await knex('profiles').select();
  },
  async profile(_, { filters }, ctx) {
    if (ctx) {
      ctx.validateAdmin();
    }

    return await knex.select('*').from('profiles').where(filters).first();
  }
}