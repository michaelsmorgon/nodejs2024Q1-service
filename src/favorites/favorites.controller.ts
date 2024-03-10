import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService, IFavorite } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/track/:id')
  addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Post('/album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Post('/artist/:id')
  addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Get()
  findAll(): IFavorite {
    return this.favoritesService.findAll();
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeTrack(id);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeAlbum(id);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
