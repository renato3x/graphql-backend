/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users_profiles', table => {
    table.integer('userId').unsigned();
    table.integer('profileId').unsigned();
    table.foreign('userId').references('users.id');
    table.foreign('profileId').references('profiles.id');
    table.primary(['userId', 'profileId']);
  }).then(() => {
    return knex('users_profiles').insert([
      { userId: 1, profileId: 2 },
      { userId: 1, profileId: 3 },
      { userId: 2, profileId: 2 },
      { userId: 3, profileId: 1 },
    ]);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users_profiles')
};
