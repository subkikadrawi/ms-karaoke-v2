import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE products_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      branch_id INT(11) NOT NULL,
      name VARCHAR(100) NOT NULL,
      category ENUM('food','drink','snack') NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      available TINYINT(1) DEFAULT '1',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY branch_id (branch_id),
      CONSTRAINT products_tbl_ibfk_1 FOREIGN KEY (branch_id) REFERENCES branches_tbl (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS products_tbl;');
}