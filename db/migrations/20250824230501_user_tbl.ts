// eslint-disable-next-line n/no-unpublished-import
import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE user_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      login VARCHAR(100) NOT NULL,
      password_hash VARCHAR(100) NOT NULL,
      first_name VARCHAR(100) DEFAULT NULL,
      last_name VARCHAR(100) DEFAULT NULL,
      email VARCHAR(100) DEFAULT NULL,
      image_url VARCHAR(100) DEFAULT NULL,
      branch_id INT(11) DEFAULT NULL,
      activated TINYINT(1) DEFAULT NULL,
      created_by INT(11) DEFAULT NULL,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_modified_by INT(11) DEFAULT NULL,
      last_modified_date DATETIME DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS user_tbl;');
}
