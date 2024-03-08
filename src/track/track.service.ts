import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { generateId } from 'src/utils/id-generator';
import { ErrorMessages } from 'src/utils/errors';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto): Track {
    const id = generateId();
    const track = new Track({
      ...createTrackDto,
      id,
    });
    this.tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return [...this.tracks];
  }

  findOne(id: string): Track {
    return this.getTrackById(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const index = this.getTrackIndexById(id);
    const oldTrack = this.getTrackById(id);
    const newTrack = new Track({
      ...oldTrack,
      ...updateTrackDto,
    });
    this.tracks.splice(index, 1, newTrack);
    return newTrack;
  }

  remove(id: string) {
    const index = this.getTrackIndexById(id);
    this.tracks.splice(index, 1);
  }

  private getTrackById(id: string): Track {
    const index = this.getTrackIndexById(id);
    return this.tracks[index];
  }

  private getTrackIndexById(id: string): number {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    }
    return index;
  }

  public setArtistIdToNull(artistId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        return {
          ...track,
          artistId: null,
        };
      }
      return track;
    });
  }

  public setAlbumIdToNull(albumId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === albumId) {
        return {
          ...track,
          albumId: null,
        };
      }
      return track;
    });
  }

  public getTracks(ids?: string[]): Track[] {
    if (ids) {
      return this.tracks.filter((track) => ids.includes(track.id));
    }
    return this.tracks;
  }
}
