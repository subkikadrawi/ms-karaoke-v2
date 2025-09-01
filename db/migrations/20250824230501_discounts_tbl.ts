import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE discounts_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      branch_id INT(11) DEFAULT NULL,
      item_type ENUM('room','product') NOT NULL,
      item_id INT(11) DEFAULT NULL,
      discount_type ENUM('percentage','amount') DEFAULT 'percentage',
      discount_value DECIMAL(10,2) NOT NULL,
      valid_from DATE NOT NULL,
      valid_to DATE NOT NULL,
      description VARCHAR(255) DEFAULT NULL,
      is_active TINYINT(1) DEFAULT '1',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS discounts_tbl;');
}