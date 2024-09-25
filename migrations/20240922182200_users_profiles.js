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
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users_profiles')
};
