import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import {
  EntityName,
  getNotFoundMsg,
  getOldPassWrongMsg,
} from 'src/utils/errors';
import { TrackService } from 'src/track/track.service';
import { DBService } from 'src/db/db.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly trackService: TrackService,
    private readonly dbService: DBService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const result = await this.dbService.album.create({
      data: { ...createAlbumDto },
    });
    return result;
  }

  async findAll(): Promise<Album[]> {
    return await this.dbService.album.findMany();
  }

  public async getAlbums(ids?: string[]): Promise<Album[]> {
    if (ids) {
      return await this.dbService.album.findMany({
        where: {
          id: { in: ids },
        },
      });
    }

    return this.findAll();
  }

  async findOne(id: string): Promise<Album> {
    return await this.dbService.album.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    let result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(getNotFoundMsg(EntityName.ALBUM));
    }
    try {
      result = await this.dbService.album.update({
        where: { id },
        data: {
          ...updateAlbumDto,
        },
      });
      return result;
    } catch {
      throw new ForbiddenException(getOldPassWrongMsg());
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(getNotFoundMsg(EntityName.ALBUM));
    }
    await this.dbService.album.delete({
      where: { id },
    });
    this.trackService.setAlbumIdToNull(id);
  }

  public async setArtistIdToNull(artistId: string): Promise<void> {
    await this.dbService.album.updateMany({
      where: { artistId },
      data: {
        artistId: null,
      },
    });
  }
}
