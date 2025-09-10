interface IAddPlaylistRequest {
  rental_id: number;
  music_id: string;
  source_karaoke: string;
  music_title: string;
  music_path_url: string;
  music_path_url_vocal: string;
  music_path_url_instrumental: string;
}

export {IAddPlaylistRequest};
