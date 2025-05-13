export interface Song{
    _id: string,
    title: string,
    artist: string,
    albumId: string,
    imageUrl: string,
    audioUrl: string,
    duration: number,
    createdAt: Date,
    updatedAt: Date,
}


export interface Album{
    _id: string,
    title: string,
    artist: string,
    imageUrl: string,
    songs: Song[],
    releaseYear: number,
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}