const knex = require('../../config/db');
const { getLoggedUser } = require('../common/user');
const bcrypt = require('bcrypt');

module.exports = {
  async login(_, { data: { email, password } }) {
    const user = await knex('users').where({ email }).first();

    if (!user) {
      throw new Error('Email is invalid');
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      throw new Error('Password is invalid');
    }

    return await getLoggedUser(user);
  },
  async users(_object, _args, ctx) {
    if (ctx) {
      ctx.validateAdmin();
    }

    return await knex
      .select('*')
      .from('users');
  },
  async user(_, { filters }, ctx) {
    if (ctx) {
      ctx.validateUserFilters(filters);
    }

    return await knex('users')
      .select()
      .where(filters)
      .first();
  },
}