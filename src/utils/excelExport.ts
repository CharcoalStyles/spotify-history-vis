import * as XLSX from 'xlsx';
import { SpotifyRecordAudiobook, SpotifyRecordPodcast, SpotifyRecordSong } from './types';
import { PostgresClient } from './postgres';

export const exportToExcel = async () => {
  const postgres = await PostgresClient.getInstance();

  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();

  // get the song data
  const songData: SpotifyRecordSong[] = (await postgres.query('SELECT * FROM spotify_songs;')).rows as SpotifyRecordSong[];
  const songWorksheet = XLSX.utils.json_to_sheet(songData);
  XLSX.utils.book_append_sheet(workbook, songWorksheet, 'Songs');

  // get the podcast data
  const podcastData: SpotifyRecordPodcast[] = (await postgres.query('SELECT * FROM spotify_podcasts;')).rows as SpotifyRecordPodcast[];
  const podcastWorksheet = XLSX.utils.json_to_sheet(podcastData);
  XLSX.utils.book_append_sheet(workbook, podcastWorksheet, 'Podcasts');

  // get the audiobook data
  const audiobookData: SpotifyRecordAudiobook[] = (await postgres.query('SELECT * FROM spotify_audiobooks;')).rows as SpotifyRecordAudiobook[];
  const audiobookWorksheet = XLSX.utils.json_to_sheet(audiobookData);
  XLSX.utils.book_append_sheet(workbook, audiobookWorksheet, 'Audiobooks');

  XLSX.writeFile(workbook, 'spotify_data.xlsx');
}