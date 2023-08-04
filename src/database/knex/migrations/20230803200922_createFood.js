exports.up = knex => knex.schema.createTable("foods", table => {
    table.increments("id").primary();
    table.text("title");
    table.text("description");
    table.text("avatarFood").default(null);
    table.decimal("price", 8,2);
    table.text("category").notNullable();

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("foods");