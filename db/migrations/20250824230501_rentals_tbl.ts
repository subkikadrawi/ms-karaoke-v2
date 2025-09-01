import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE rentals_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      branch_id INT(11) NOT NULL,
      rental_item_id INT(11) NOT NULL,
      user_id INT(11) NOT NULL,
      customer_name VARCHAR(100) DEFAULT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      total_price DECIMAL(10,2) DEFAULT NULL,
      status ENUM('booked','active','completed','cancelled') DEFAULT 'booked',
      payment_status ENUM('unpaid','paid','partial','refunded') DEFAULT 'unpaid',
      has_transaction TINYINT(1) DEFAULT '0',
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY rental_item_id (rental_item_id),
      KEY branch_id (branch_id),
      KEY user_id (user_id),
      CONSTRAINT rentals_tbl_ibfk_1 FOREIGN KEY (rental_item_id) REFERENCES rental_items_tbl (id),
      CONSTRAINT rentals_tbl_ibfk_2 FOREIGN KEY (branch_id) REFERENCES branches_tbl (id),
      CONSTRAINT rentals_tbl_ibfk_3 FOREIGN KEY (user_id) REFERENCES user_tbl (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS rentals_tbl;');
}