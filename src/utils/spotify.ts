import { PostgresClient } from './postgres';
import {
	SpotifyRecord,
	SpotifyRecordSong,
	SpotifyRecordPodcast,
	SpotifyRecordAudiobook,
	isSpotifyRecordAudiobook,
	isSpotifyRecordPodcast,
	isSpotifyRecordSong,
	trimSpotifyAudiobookRecord,
	trimSpotifyPodcastRecord,
	trimSpotifySongRecord,
} from './types';

export const parseSpotifyData = (data: Map<string, string>) => {
	const jsonFiles = Array.from(data.entries()).filter(([filename, _]) =>
		filename.endsWith('.json')
	);

	const parsedData: Record<string, any> = {};

	for (const [filename, content] of jsonFiles) {
		try {
			parsedData[filename] = JSON.parse(content) as Array<SpotifyRecord>;
		} catch (error) {
			console.error(`Error parsing JSON from file ${filename}:`, error);
		}
	}

	return parsedData;
};

export const storeSpotifyData = async (data: Record<string, Array<SpotifyRecord>>) => {
  console.log('Storing Spotify data into the database...');
	const items: {
		songs: SpotifyRecordSong[];
		podcasts: SpotifyRecordPodcast[];
		audiobooks: SpotifyRecordAudiobook[];
	} = { songs: [], podcasts: [], audiobooks: [] };

	for (const [filename, records] of Object.entries(data)) {
    console.log(`Processing file: ${filename} with ${records.length} records.`);
		for (const record of records) {
			if (isSpotifyRecordAudiobook(record)) {
				items.audiobooks.push(trimSpotifyAudiobookRecord(record));
			} else if (isSpotifyRecordPodcast(record)) {
				items.podcasts.push(trimSpotifyPodcastRecord(record));
			} else if (isSpotifyRecordSong(record)) {
				items.songs.push(trimSpotifySongRecord(record));
			}
		}
	}

  console.log(items)

  console.log("creating tables if not exist...");
  await PostgresClient.createTables();
  console.log("batch inserting songs...");
  const batchSize = 500;

  for (let i = 0; i < items.songs.length; i += batchSize) {
    const batch = items.songs.slice(i, i + batchSize);
    await PostgresClient.insertBulkSongs(batch);
    console.log(`Inserted batch ${i / batchSize + 1}`);
  }
  console.log("Finished inserting all songs.");

  console.log("batch inserting podcasts...");
  for (let i = 0; i < items.podcasts.length; i += batchSize) {
    const batch = items.podcasts.slice(i, i + batchSize);
    await PostgresClient.insertBulkPodcasts(batch);
    console.log(`Inserted batch ${i / batchSize + 1}`);
  }
  console.log("Finished inserting all podcasts.");
  
  console.log("batch inserting audiobooks..."); 
  for (let i = 0; i < items.audiobooks.length; i += batchSize) {
    const batch = items.audiobooks.slice(i, i + batchSize);
    await PostgresClient.insertBulkAudiobooks(batch);
    console.log(`Inserted batch ${i / batchSize + 1}`);
  }
  console.log("Finished inserting all audiobooks.");

};
