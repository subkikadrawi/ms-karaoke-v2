import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE transaction_items_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      branch_id INT(11) NOT NULL,
      transaction_id INT(11) NOT NULL,
      product_id INT(11) NOT NULL,
      quantity INT(11) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY transaction_id (transaction_id),
      KEY branch_id (branch_id),
      KEY product_id (product_id),
      CONSTRAINT transaction_items_tbl_ibfk_1 FOREIGN KEY (transaction_id) REFERENCES transactions_tbl (id),
      CONSTRAINT transaction_items_tbl_ibfk_2 FOREIGN KEY (branch_id) REFERENCES branches_tbl (id),
      CONSTRAINT transaction_items_tbl_ibfk_3 FOREIGN KEY (product_id) REFERENCES products_tbl (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS transaction_items_tbl;');
}