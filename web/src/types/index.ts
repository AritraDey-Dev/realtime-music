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

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}
