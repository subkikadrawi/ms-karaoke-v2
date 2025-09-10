import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE karaoke_playlist_2025 (
      id int(11) PRIMARY KEY,
      transaction_id INT,
      sequence INT,
      music_id VARCHAR(255),
      source_karaoke VARCHAR(100),
      music_title VARCHAR(255),
      music_path_url VARCHAR(255),
      music_path_url_vocal VARCHAR(255),
      music_path_url_instrumental VARCHAR(255),
      status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INT
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE IF EXISTS karaoke_playlist_2025;');
}