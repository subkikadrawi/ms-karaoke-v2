import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE branches_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      address TEXT,
      phone VARCHAR(50) DEFAULT NULL,
      is_active TINYINT(1) DEFAULT '1',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS branches_tbl;');
}