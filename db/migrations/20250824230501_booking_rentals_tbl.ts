import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE booking_rentals_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      branch_id INT(11) NOT NULL,
      rental_item_id INT(11) NOT NULL,
      customer_id INT(11) DEFAULT NULL,
      customer_name VARCHAR(100) DEFAULT NULL,
      phone VARCHAR(20) DEFAULT NULL,
      booking_date DATE NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      status ENUM('pending','confirmed','cancelled','expired') DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY branch_id (branch_id),
      KEY rental_item_id (rental_item_id),
      KEY customer_id (customer_id),
      CONSTRAINT booking_rentals_tbl_ibfk_1 FOREIGN KEY (branch_id) REFERENCES branches_tbl (id),
      CONSTRAINT booking_rentals_tbl_ibfk_2 FOREIGN KEY (rental_item_id) REFERENCES rental_items_tbl (id),
      CONSTRAINT booking_rentals_tbl_ibfk_3 FOREIGN KEY (customer_id) REFERENCES customers_tbl (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS booking_rentals_tbl;');
}