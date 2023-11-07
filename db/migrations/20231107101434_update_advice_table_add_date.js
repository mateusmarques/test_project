exports.up = (knex) => {
  return knex.schema.alterTable('advices', (t) => {
    t.timestamp('date').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('advices', (t) => {
    t.dropColumn('date');
  });
};
