import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE rental_items_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      branch_id INT(11) NOT NULL,
      name VARCHAR(100) NOT NULL,
      category ENUM('karaoke','billiard') NOT NULL,
      price_per_hour DECIMAL(10,2) NOT NULL,
      status ENUM('available','in_use','maintenance') DEFAULT 'available',
      room_number VARCHAR(20) DEFAULT NULL,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY branch_id (branch_id),
      CONSTRAINT rental_items_tbl_ibfk_1 FOREIGN KEY (branch_id) REFERENCES branches_tbl (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS rental_items_tbl;');
}