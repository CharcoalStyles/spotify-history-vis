import { BlobReader, FileEntry, TextWriter, ZipReader } from '@zip.js/zip.js';

export async function unzipBlobToTextMap(zipBlob: Blob): Promise<Map<string, string>> {
	console.log('Unzipping blob:', zipBlob);
	const textMap = new Map<string, string>();

	const zipReader = new ZipReader(new BlobReader(zipBlob));
	const entries = await zipReader.getEntries();
	console.log('Zip entries found:', entries.length);

	for (const entry of entries) {
		console.log('Processing entry:', entry.filename);
		if (!entry.directory) {
			const e = entry as FileEntry;
			const textWriter = new TextWriter();
			await e.getData(textWriter);
			const textContent = await textWriter.getData();
			textMap.set(entry.filename, textContent);
		}
	}

	await zipReader.close();
	return textMap;
}
