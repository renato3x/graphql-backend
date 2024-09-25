const knex = require('../../config/db');

module.exports = {
  async newUser(_, { data }) {
    const dataClone = JSON.parse(JSON.stringify(data))
    const profiles = [];

    if (dataClone.profiles) {
      profiles.push(...data.profiles);
      delete dataClone.profiles;
    }

    return await knex('users')
      .insert(dataClone)
      .then(async ids => {
        for (const profile of profiles) {
          const profileExists = await knex
            .select('id')
            .from('profiles')
            .where(profile)
            .first();
    
          if (profileExists) {
            await knex('users_profiles').insert({ userId: ids[0], profileId: profileExists.id });
          }
        }

        return await knex('users').select().where('id', '=', ids[0]).first();
      });
  },
  async deleteUser(_, { filters }) {
    const user = await knex('users').select().where(filters).first();
    
    if (user) {
      await knex.delete()
        .from('users_profiles')
        .where('userId', '=', user.id);
      
      await knex('users')
        .delete()
        .where('id', '=', user.id);
    }

    return user;
  },
  async updateUser(_, { filters, data }) {
    const user = await knex('users').select().where(filters).first();

    if (user) {
      const cloneData = JSON.parse(JSON.stringify(data));
      const profiles = [];

      if (cloneData.profiles) {
        profiles.push(...data.profiles);
        delete cloneData.profiles;
      }

      return await knex('users')
        .update(cloneData)
        .where('id', '=', user.id)
        .then(async () => {
          for (const profile of profiles) {
            const profileExists = await knex
              .select('id')
              .from('profiles')
              .where(profile)
              .first();
    
            if (profileExists) {
              await knex('users_profiles').insert({ userId: user.id, profileId: profileExists.id });
            }
          }

          return await knex('users').select().where('id', '=', user.id).first();
        })
    }

    return user;
  }
}