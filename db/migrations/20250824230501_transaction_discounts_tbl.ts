import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE transaction_discounts_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      transaction_id INT(11) NOT NULL,
      item_type ENUM('room','product') NOT NULL,
      item_id INT(11) DEFAULT NULL,
      discount_type ENUM('percentage','amount') NOT NULL,
      discount_value DECIMAL(10,2) NOT NULL,
      source ENUM('manual','promo','voucher') DEFAULT 'promo',
      notes VARCHAR(255) DEFAULT NULL,
      created_by INT(11) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY transaction_id (transaction_id),
      CONSTRAINT transaction_discounts_tbl_ibfk_1 FOREIGN KEY (transaction_id) REFERENCES transactions_tbl (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS transaction_discounts_tbl;');
}