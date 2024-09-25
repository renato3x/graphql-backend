/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('profiles', table => {
    table.increments('id').primary()
    table.string('name').notNullable().unique()
    table.string('label').notNullable()
  }).then(() => {
    return knex('profiles').insert([
      { name: 'common', label: 'Common' },
      { name: 'admin', label: 'Administrator' },
    ]);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('profiles');
};
