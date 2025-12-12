import { SpotifyRecordBase, SpotifyRecordSong, SpotifyRecordPodcast, SpotifyRecordAudiobook, isSpotifyRecordSong, isSpotifyRecordPodcast, isSpotifyRecordAudiobook } from './types';
import { PGlite } from '@electric-sql/pglite';

export class PostgresClient {
	private static instance: PGlite | null = null;

	static async getInstance(): Promise<PGlite> {
		if (!PostgresClient.instance) {
			PostgresClient.instance = new PGlite({
				// Configuration options can be added here
			});
		}
		return PostgresClient.instance;
	}

	static async createTables() {
		const db = await PostgresClient.getInstance();
		// Create table for Song records
		await db.query(`
      CREATE TABLE IF NOT EXISTS spotify_songs (
        id SERIAL PRIMARY KEY,
        ts TIMESTAMP,
        platform TEXT,
        ms_played INTEGER,
        conn_country TEXT,
        ip_addr TEXT,
        reason_start TEXT,
        reason_end TEXT,
        shuffle BOOLEAN,
        skipped BOOLEAN,
        offline BOOLEAN,
        offline_timestamp JSONB,
        incognito_mode BOOLEAN, 
        master_metadata_track_name TEXT,
        master_metadata_album_artist_name TEXT,
        master_metadata_album_album_name TEXT,
        spotify_track_uri TEXT
      );
    `);

		// Create table for Podcast records
		await db.query(`
      CREATE TABLE IF NOT EXISTS spotify_podcasts (
        id SERIAL PRIMARY KEY,
        ts TIMESTAMP,
        platform TEXT,
        ms_played INTEGER,
        conn_country TEXT,
        ip_addr TEXT,
        reason_start TEXT,
        reason_end TEXT,
        shuffle BOOLEAN,
        skipped BOOLEAN,
        offline BOOLEAN,
        offline_timestamp JSONB,
        incognito_mode BOOLEAN, 
        podcast_episode_name TEXT,
        podcast_show_name TEXT,
        spotify_episode_uri TEXT
      );
    `);

		// Create table for Audiobook records
		await db.query(`
      CREATE TABLE IF NOT EXISTS spotify_audiobooks (
        id SERIAL PRIMARY KEY,
        ts TIMESTAMP,
        platform TEXT,
        ms_played INTEGER,
        conn_country TEXT,
        ip_addr TEXT,
        reason_start TEXT,
        reason_end TEXT,
        shuffle BOOLEAN,
        skipped BOOLEAN,
        offline BOOLEAN,
        offline_timestamp JSONB,
        incognito_mode BOOLEAN, 
        audiobook_title TEXT,
        audiobook_uri TEXT,
        audiobook_chapter_uri TEXT,
        audiobook_chapter_title TEXT
      );
    `);
	};

  static async insertBulkSongs(songs: SpotifyRecordSong[]) {
    const db = await PostgresClient.getInstance();
    const values = songs.map(song => [
      song.ts,
      song.platform,
      song.ms_played,
      song.conn_country,
      song.ip_addr,
      song.reason_start,
      song.reason_end,
      song.shuffle,
      song.skipped,
      song.offline,
      JSON.stringify(song.offline_timestamp),
      song.incognito_mode,
      song.master_metadata_track_name,
      song.master_metadata_album_artist_name,
      song.master_metadata_album_album_name,
      song.spotify_track_uri
    ]);

    const query = `
      INSERT INTO spotify_songs (
        ts, platform, ms_played, conn_country, ip_addr, reason_start, reason_end, 
        shuffle, skipped, offline, offline_timestamp, incognito_mode, 
        master_metadata_track_name, master_metadata_album_artist_name, 
        master_metadata_album_album_name, spotify_track_uri
      ) VALUES ${values.map((_, i) => `(${values[i].map((_, j) => `$${i * values[0].length + j + 1}`).join(', ')})`).join(', ')}
    `;

    await db.query(query, values.flat()); 

    console.log(`Inserted ${songs.length} songs into the database.`);
  };

  static async insertBulkPodcasts(podcasts: SpotifyRecordPodcast[]) {
    const db = await PostgresClient.getInstance();
    const values = podcasts.map(podcast => [
      podcast.ts,
      podcast.platform,
      podcast.ms_played,
      podcast.conn_country,
      podcast.ip_addr,
      podcast.reason_start,
      podcast.reason_end,
      podcast.shuffle,
      podcast.skipped,
      podcast.offline,
      JSON.stringify(podcast.offline_timestamp),
      podcast.incognito_mode,
      podcast.podcast_episode_name,
      podcast.podcast_show_name,
      podcast.spotify_episode_uri
    ]);

    const query = `
      INSERT INTO spotify_podcasts (
        ts, platform, ms_played, conn_country, ip_addr, reason_start, reason_end, 
        shuffle, skipped, offline, offline_timestamp, incognito_mode, 
        podcast_episode_name, podcast_show_name, spotify_episode_uri
      ) VALUES ${values.map((_, i) => `(${values[i].map((_, j) => `$${i * values[0].length + j + 1}`).join(', ')})`).join(', ')}
    `;

    await db.query(query, values.flat()); 

    console.log(`Inserted ${podcasts.length} podcasts into the database.`);
  };

  static async insertBulkAudiobooks(audiobooks: SpotifyRecordAudiobook[]) {
    const db = await PostgresClient.getInstance();
    const values = audiobooks.map(audiobook => [
      audiobook.ts,
      audiobook.platform,
      audiobook.ms_played,
      audiobook.conn_country,
      audiobook.ip_addr,
      audiobook.reason_start,
      audiobook.reason_end,
      audiobook.shuffle,
      audiobook.skipped,
      audiobook.offline,
      JSON.stringify(audiobook.offline_timestamp),
      audiobook.incognito_mode,
      audiobook.audiobook_title,
      audiobook.audiobook_uri,
      audiobook.audiobook_chapter_uri,
      audiobook.audiobook_chapter_title
    ]);

    const query = `
      INSERT INTO spotify_audiobooks (
        ts, platform, ms_played, conn_country, ip_addr, reason_start, reason_end, 
        shuffle, skipped, offline, offline_timestamp  , incognito_mode, 
        audiobook_title, audiobook_uri, audiobook_chapter_uri, audiobook_chapter_title
      ) VALUES ${values.map((_, i) => `(${values[i].map((_, j) => `$${i * values[0].length + j + 1}`).join(', ')})`).join(', ')}
    `;

    await db.query(query, values.flat()); 

    console.log(`Inserted ${audiobooks.length} audiobooks into the database.`);
  }
}
