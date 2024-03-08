import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { generateId } from 'src/utils/id-generator';
import { ErrorMessages } from 'src/utils/errors';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto): Album {
    const id = generateId();
    const album = new Album({
      ...createAlbumDto,
      id,
    });
    this.albums.push(album);
    return album;
  }

  findAll(): Album[] {
    return [...this.albums];
  }

  findOne(id: string): Album {
    return this.getAlbumById(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const index = this.getAlbumIndexById(id);
    const oldAlbum = this.getAlbumById(id);
    const newAlbum = new Album({
      ...oldAlbum,
      ...updateAlbumDto,
    });
    this.albums.splice(index, 1, newAlbum);
    return newAlbum;
  }

  remove(id: string) {
    const index = this.getAlbumIndexById(id);
    this.albums.splice(index, 1);
  }

  private getAlbumById(id: string): Album {
    const index = this.getAlbumIndexById(id);
    return this.albums[index];
  }

  private getAlbumIndexById(id: string): number {
    const index = this.albums.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    }
    return index;
  }
}
