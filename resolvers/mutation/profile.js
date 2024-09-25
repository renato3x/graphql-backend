const knex = require('../../config/db');

module.exports = {
  async newProfile(_, { data }) {
    return await knex('profiles')
      .insert(data)
      .then(async ([ id ]) => {
        return await knex.select('*').from('profiles').where({ id }).first();
      })
  },
  async deleteProfile(_, { filters }) {
    const profile = await knex.select().from('profiles').where(filters).first();

    if (profile) {
      return await knex('users_profiles')
        .delete()
        .where('profileId', '=', profile.id)
        .then(async () => {
          await knex.delete().from('profiles').where('id', '=', profile.id);
          return profile;
        });
    }

    return profile;
  },
  async updateProfile(_, { filters, data }) {
    const profile = await knex('profiles').select('*').where(filters).first();

    if (profile) {
      return knex('profiles')
        .update(data)
        .where('id', '=', profile.id)
        .then(async () => {
          return await knex('profiles').select().where('id', '=', profile.id).first();
        });
    }

    return profile;
  }
}