import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import {
  EntityName,
  getNotFoundMsg,
  getOldPassWrongMsg,
} from 'src/utils/errors';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { DBService } from 'src/db/db.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly dbService: DBService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const result = await this.dbService.artist.create({
      data: { ...createArtistDto },
    });
    return result;
  }

  async findAll(): Promise<Artist[]> {
    return await this.dbService.artist.findMany();
  }

  public async getArtists(ids?: string[]): Promise<Artist[]> {
    if (ids) {
      return await this.dbService.artist.findMany({
        where: {
          id: { in: ids },
        },
      });
    }

    return this.findAll();
  }

  async findOne(id: string): Promise<Artist> {
    return await this.dbService.artist.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    let result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(getNotFoundMsg(EntityName.ARTIST));
    }
    try {
      result = await this.dbService.artist.update({
        where: { id },
        data: {
          ...updateArtistDto,
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
      throw new NotFoundException(getNotFoundMsg(EntityName.ARTIST));
    }
    await this.dbService.artist.delete({
      where: { id },
    });
    this.trackService.setArtistIdToNull(id);
    this.albumService.setArtistIdToNull(id);
  }
}
