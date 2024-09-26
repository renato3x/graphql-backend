const bcrypt = require('bcrypt');
const knex = require('../../config/db');

module.exports = {
  async registerUser(_, { data }) {
    const { profileId } = await knex('profiles')
      .select('id as profileId')
      .where({ name: 'common' })
      .first();
    
    return await knex('users').insert({
      ...data,
      password: bcrypt.hashSync(data.password, 10)
    }).then(async ([ userId ]) => {
      await knex('users_profiles').insert({ userId, profileId });

      return await knex('users').select().where({ id: userId }).first();
    });
  },
  async newUser(_, { data }) {
    const dataClone = JSON.parse(JSON.stringify(data))
    const profiles = [];

    if (!dataClone.profiles || dataClone.profiles.length === 0) {
      profiles.push({ name: 'common' });
    } else {
      profiles.push(...data.profiles);
      delete dataClone.profiles;
    } 

    dataClone.password = bcrypt.hashSync(dataClone.password, 10);

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
      const dataClone = JSON.parse(JSON.stringify(data));
      const profiles = [];

      if (dataClone.profiles) {
        profiles.push(...data.profiles);
        delete dataClone.profiles;
      }

      if (dataClone.password) {
        dataClone.password = bcrypt.hashSync(dataClone.password, 10);
      }

      return await knex('users')
        .update(dataClone)
        .where('id', '=', user.id)
        .then(async () => {
          if (profiles.length > 0) {
            await knex('users_profiles')
              .delete()
              .where('userId', '=', user.id);
  
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
          }

          return await knex('users').select().where('id', '=', user.id).first();
        })
    }

    return user;
  }
}