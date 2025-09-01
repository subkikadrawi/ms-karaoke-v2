import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE karaoke_music_tbl (
      id INT(11) NOT NULL AUTO_INCREMENT,
      branchId INT(11) DEFAULT NULL,
      categoryId INT(11) DEFAULT NULL COMMENT '1) indonesia, 2) dangdut, 3) barat, 4) mandarin, 5) jepang, 6) korea',
      title VARCHAR(255) DEFAULT NULL,
      pathUrl VARCHAR(255) DEFAULT NULL,
      pathUrlImage VARCHAR(255) DEFAULT NULL,
      pathUrlVocal VARCHAR(255) DEFAULT NULL,
      pathUrlInstrumental VARCHAR(255) DEFAULT NULL,
      sourceKaraoke VARCHAR(50) DEFAULT NULL,
      created_at DATETIME DEFAULT NULL,
      update_at DATETIME DEFAULT NULL,
      created_by INT(11) DEFAULT NULL,
      update_by INT(11) DEFAULT NULL,
      status INT(11) DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=latin1;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS karaoke_music_tbl;');
}