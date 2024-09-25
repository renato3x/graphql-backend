/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password');
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  }).then(() => {
    return knex('users').insert([
      { name: 'João Show', email: 'jshow@empresa.com.br', password: '12345678' },
      { name: 'Jaime Lannister', email: 'jlann@empresa.com.br', password: '12345678' },
      { name: 'Gabriela T. Nunes', email: 'gtnunes@empresa.com.br', password: '12345678' },
    ])
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
