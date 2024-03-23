import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { EntityName, getNotExistMsg } from 'src/utils/errors';
import { DBService } from 'src/db/db.service';
import { generateId } from 'src/utils/id-generator';

export interface IFavorite {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavoritesService {
  private favoriteId = null;
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly dbService: DBService,
  ) {
    this.setFavoriteId();
  }

  async addTrack(id: string) {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException(getNotExistMsg(EntityName.TRACK));
    }
    const favsId = this.favoriteId;
    await this.dbService.track.update({
      where: { id },
      data: {
        ...track,
        favsId: {
          set: favsId,
        },
      },
    });
  }

  async addAlbum(id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new UnprocessableEntityException(getNotExistMsg(EntityName.ALBUM));
    }
    const favsId = this.favoriteId;
    await this.dbService.album.update({
      where: { id },
      data: {
        ...album,
        favsId: {
          set: favsId,
        },
      },
    });
  }

  async addArtist(id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new UnprocessableEntityException(getNotExistMsg(EntityName.ARTIST));
    }
    const favsId = this.favoriteId;
    const res = await this.dbService.artist.update({
      where: { id },
      data: {
        ...artist,
        favsId: {
          set: favsId,
        },
      },
    });
  }

  async findAll(): Promise<IFavorite> {
    const favId = this.favoriteId;
    const res = await this.dbService.favorites.findUnique({
      where: {
        id: favId,
      },
      include: {
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true,
          },
        },
        artist: {
          select: {
            id: true,
            grammy: true,
            name: true,
          },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            artistId: true,
            albumId: true,
            duration: true,
          },
        },
      },
    });
    return {
      albums: res?.albums ? res.albums : [],
      artists: res?.artist ? res.artist : [],
      tracks: res?.tracks ? res.tracks : [],
    };
  }

  async removeTrack(id: string) {
    await this.dbService.track.updateMany({
      where: {
        id,
      },
      data: {
        favsId: null,
      },
    });
  }

  async removeAlbum(id: string) {
    await this.dbService.album.updateMany({
      where: {
        id,
      },
      data: {
        favsId: null,
      },
    });
  }

  async removeArtist(id: string) {
    await this.dbService.artist.updateMany({
      where: {
        id,
      },
      data: {
        favsId: null,
      },
    });
  }

  private async setFavoriteId() {
    if (this.favoriteId) {
      return;
    }
    const favId = await this.dbService.favorites.findFirst({});
    if (favId) {
      this.favoriteId = favId.id;
      return this.favoriteId;
    }
    const res = await this.dbService.favorites.create({
      data: {
        id: generateId(),
      },
    });
    this.favoriteId = res.id;
  }
}
