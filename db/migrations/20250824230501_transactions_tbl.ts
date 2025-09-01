import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE transactions_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      invoice_number VARCHAR(50) NOT NULL,
      branch_id INT(11) NOT NULL,
      rental_id INT(11) DEFAULT NULL,
      user_id INT(11) NOT NULL,
      total_amount DECIMAL(10,2) DEFAULT '0.00',
      payment_status ENUM('unpaid','paid','partial','refunded') DEFAULT 'unpaid',
      payment_method ENUM('cash','qris','card') DEFAULT 'cash',
      transaction_type ENUM('rental','food-drink','mixed') DEFAULT 'food-drink',
      customer_id INT(11) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY invoice_number (invoice_number),
      KEY rental_id (rental_id),
      KEY branch_id (branch_id),
      KEY user_id (user_id),
      KEY customer_id (customer_id),
      CONSTRAINT transactions_tbl_ibfk_1 FOREIGN KEY (rental_id) REFERENCES rentals_tbl (id),
      CONSTRAINT transactions_tbl_ibfk_2 FOREIGN KEY (branch_id) REFERENCES branches_tbl (id),
      CONSTRAINT transactions_tbl_ibfk_3 FOREIGN KEY (user_id) REFERENCES user_tbl (id),
      CONSTRAINT transactions_tbl_ibfk_4 FOREIGN KEY (customer_id) REFERENCES customers_tbl (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS transactions_tbl;');
}