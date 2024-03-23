import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import {
  EntityName,
  getNotFoundMsg,
  getOldPassWrongMsg,
} from 'src/utils/errors';
import { DBService } from 'src/db/db.service';

@Injectable()
export class TrackService {
  constructor(private readonly dbService: DBService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const result = await this.dbService.track.create({
      data: { ...createTrackDto },
    });
    return result;
  }

  async findAll(): Promise<Track[]> {
    return await this.dbService.track.findMany();
  }

  public async getTracks(ids?: string[]): Promise<Track[]> {
    if (ids) {
      return await this.dbService.track.findMany({
        where: {
          id: { in: ids },
        },
      });
    }

    return this.findAll();
  }

  public async findOne(id: string): Promise<Track> {
    return await this.dbService.track.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    let result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(getNotFoundMsg(EntityName.TRACK));
    }
    try {
      result = await this.dbService.track.update({
        where: { id },
        data: {
          ...updateTrackDto,
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
      throw new NotFoundException(getNotFoundMsg(EntityName.TRACK));
    }
    await this.dbService.track.delete({
      where: { id },
    });
  }

  public async setArtistIdToNull(artistId: string): Promise<void> {
    await this.dbService.track.updateMany({
      where: { artistId },
      data: {
        artistId: null,
      },
    });
  }

  public async setAlbumIdToNull(albumId: string): Promise<void> {
    await this.dbService.track.updateMany({
      where: { albumId },
      data: {
        albumId: null,
      },
    });
  }
}
