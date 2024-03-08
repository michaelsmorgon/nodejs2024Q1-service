import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { generateId } from 'src/utils/id-generator';
import { ErrorMessages } from 'src/utils/errors';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const id = generateId();
    const artist = new Artist({
      ...createArtistDto,
      id,
    });
    this.artists.push(artist);
    return artist;
  }

  findAll(): Artist[] {
    return [...this.artists];
  }

  findOne(id: string): Artist {
    return this.getArtistById(id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const index = this.getArtistIndexById(id);
    const oldArtist = this.getArtistById(id);
    const newArtist = new Artist({
      ...oldArtist,
      grammy: updateArtistDto.grammy,
      name: updateArtistDto.name,
    });
    this.artists.splice(index, 1, newArtist);
    return newArtist;
  }

  remove(id: string) {
    const index = this.getArtistIndexById(id);
    this.artists.splice(index, 1);
  }

  private getArtistById(id: string): Artist {
    const index = this.getArtistIndexById(id);
    return this.artists[index];
  }

  private getArtistIndexById(id: string): number {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    }
    return index;
  }
}
