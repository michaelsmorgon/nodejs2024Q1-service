import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { ErrorMessages } from 'src/utils/errors';

export interface IFavorite {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavoritesService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}
  private favorite: Favorite = {
    albums: [],
    artists: [],
    tracks: [],
  };

  addTrack(id: string) {
    const tracks = this.trackService.getTracks();
    if (tracks.findIndex((track) => track.id === id) === -1) {
      throw new UnprocessableEntityException(ErrorMessages.NOT_EXIST);
    }
    const favTracks = this.favorite.tracks;
    if (!favTracks.find((value) => value === id)) {
      favTracks.push(id);
    }

    this.favorite = {
      ...this.favorite,
      tracks: favTracks,
    };
  }

  addAlbum(id: string) {
    const albums = this.albumService.getAlbums();
    if (albums.findIndex((album) => album.id === id) === -1) {
      throw new UnprocessableEntityException(ErrorMessages.NOT_EXIST);
    }
    const favAlbums = this.favorite.albums;
    if (!favAlbums.find((value) => value === id)) {
      favAlbums.push(id);
    }

    this.favorite = {
      ...this.favorite,
      albums: favAlbums,
    };
  }

  addArtist(id: string) {
    const artists = this.artistService.getArtists();
    if (artists.findIndex((artist) => artist.id === id) === -1) {
      throw new UnprocessableEntityException(ErrorMessages.NOT_EXIST);
    }
    const favArtists = this.favorite.artists;
    if (!favArtists.find((value) => value === id)) {
      favArtists.push(id);
    }

    this.favorite = {
      ...this.favorite,
      artists: favArtists,
    };
  }

  findAll(): IFavorite {
    const favoriteArtists = this.artistService.getArtists(
      this.favorite.artists,
    );
    const favoriteAlbums = this.albumService.getAlbums(this.favorite.albums);
    const favoriteTracks = this.trackService.getTracks(this.favorite.tracks);
    return {
      albums: favoriteAlbums,
      artists: favoriteArtists,
      tracks: favoriteTracks,
    };
  }

  removeTrack(id: string) {
    const favTracks = this.favorite.tracks;
    const index = this.getIndexById(id, favTracks);
    favTracks.splice(index, 1);

    this.favorite = {
      ...this.favorite,
      tracks: favTracks,
    };
  }

  removeAlbum(id: string) {
    const favAlbums = this.favorite.albums;
    const index = this.getIndexById(id, favAlbums);
    favAlbums.splice(index, 1);

    this.favorite = {
      ...this.favorite,
      albums: favAlbums,
    };
  }

  removeArtist(id: string) {
    const favArtists = this.favorite.artists;
    const index = this.getIndexById(id, favArtists);
    favArtists.splice(index, 1);

    this.favorite = {
      ...this.favorite,
      artists: favArtists,
    };
  }

  private getIndexById(id: string, list: string[]): number {
    const index = list.findIndex((value) => value === id);
    if (index === -1) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    }
    return index;
  }
}
