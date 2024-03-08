import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService, IFavorite } from './favorites.service';
import { IdValidationPipe } from 'src/pipes/id-validation-pipe';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/track/:id')
  addTrack(@Param('id', IdValidationPipe) id: string) {
    console.log('track', id);
    return this.favoritesService.addTrack(id);
  }

  @Post('/album/:id')
  addAlbum(@Param('id', IdValidationPipe) id: string) {
    console.log('album', id);
    return this.favoritesService.addAlbum(id);
  }

  @Post('/artist/:id')
  addArtist(@Param('id', IdValidationPipe) id: string) {
    console.log('artist', id);
    return this.favoritesService.addArtist(id);
  }

  @Get()
  findAll(): IFavorite {
    return this.favoritesService.findAll();
  }

  @Delete('/track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', IdValidationPipe) id: string) {
    return this.favoritesService.removeTrack(id);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', IdValidationPipe) id: string) {
    return this.favoritesService.removeAlbum(id);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', IdValidationPipe) id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
