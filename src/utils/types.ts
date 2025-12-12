
export type SpotifyRecordBase = {
  ts: Date;
  platform: string;
  ms_played: number;
  conn_country: string;
  ip_addr: string;
  reason_start: string;
  reason_end: string;
  shuffle: boolean;
  skipped: boolean;
  offline: boolean;
  offline_timestamp: object;
  incognito_mode: boolean;
};
export type SpotifyRecordSong = SpotifyRecordBase & {
  master_metadata_track_name: string;
  master_metadata_album_artist_name: string;
  master_metadata_album_album_name: string;
  spotify_track_uri: string;
};
export type SpotifyRecordPodcast = SpotifyRecordBase & {
  podcast_episode_name: string;
  podcast_show_name: string;
  spotify_episode_uri: string;
};
export type SpotifyRecordAudiobook = SpotifyRecordBase & {
  audiobook_title: string;
  audiobook_uri: string;
  audiobook_chapter_uri: string;
  audiobook_chapter_title: string;
};
export function isSpotifyRecordSong(obj: any): obj is SpotifyRecordSong {
  return typeof obj === 'object' && obj !== null && typeof obj.master_metadata_track_name === 'string' && typeof obj.master_metadata_album_artist_name === 'string' && typeof obj.master_metadata_album_album_name === 'string' && typeof obj.spotify_track_uri === 'string' && typeof obj.master_metadata_track_name !== null && typeof obj.master_metadata_album_artist_name !== null && typeof obj.master_metadata_album_album_name !== null && typeof obj.spotify_track_uri !== null;
}
export function isSpotifyRecordPodcast(obj: any): obj is SpotifyRecordPodcast {
  return typeof obj === 'object' && obj !== null && typeof obj.podcast_episode_name === 'string' && typeof obj.podcast_show_name === 'string' && typeof obj.spotify_episode_uri === 'string' && typeof obj.podcast_episode_name !== null && typeof obj.podcast_show_name !== null && typeof obj.spotify_episode_uri !== null;
}
export function isSpotifyRecordAudiobook(obj: any): obj is SpotifyRecordAudiobook {
  return typeof obj === 'object' && obj !== null && typeof obj.audiobook_title === 'string' && typeof obj.audiobook_uri === 'string' && typeof obj.audiobook_chapter_uri === 'string' && typeof obj.audiobook_chapter_title === 'string' && typeof obj.audiobook_title !== null && typeof obj.audiobook_uri !== null && typeof obj.audiobook_chapter_uri !== null && typeof obj.audiobook_chapter_title !== null;
}
export const baseKeys = ['ts', 'platform', 'ms_played', 'conn_country', 'ip_addr', 'reason_start', 'reason_end', 'shuffle', 'skipped', 'offline', 'offline_timestamp', 'incognito_mode'];
export const songKeys = [...baseKeys, 'master_metadata_track_name', 'master_metadata_album_artist_name', 'master_metadata_album_album_name', 'spotify_track_uri'];
export const podcastKeys = [...baseKeys, 'podcast_episode_name', 'podcast_show_name', 'spotify_episode_uri'];
export const audiobookKeys = [...baseKeys, 'audiobook_title', 'audiobook_uri', 'audiobook_chapter_uri', 'audiobook_chapter_title'];

export const trimSpotifySongRecord = (record: SpotifyRecordSong): SpotifyRecordSong => {
  const trimmedRecord: any = {};
  for (const key of songKeys) {
    trimmedRecord[key] = record[key as keyof SpotifyRecordSong];
  }
  return trimmedRecord as SpotifyRecordSong;
}

export const trimSpotifyPodcastRecord = (record: SpotifyRecordPodcast): SpotifyRecordPodcast => {
  const trimmedRecord: any = {};
  for (const key of podcastKeys) {
    trimmedRecord[key] = record[key as keyof SpotifyRecordPodcast];
  }
  return trimmedRecord as SpotifyRecordPodcast;
}

export const trimSpotifyAudiobookRecord = (record: SpotifyRecordAudiobook): SpotifyRecordAudiobook => {
  const trimmedRecord: any = {};
  for (const key of audiobookKeys) {
    trimmedRecord[key] = record[key as keyof SpotifyRecordAudiobook];
  }
  return trimmedRecord as SpotifyRecordAudiobook;
}
  

export type SpotifyRecord = SpotifyRecordSong | SpotifyRecordPodcast | SpotifyRecordAudiobook;