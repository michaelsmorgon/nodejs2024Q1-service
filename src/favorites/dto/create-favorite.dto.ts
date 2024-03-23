import { IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty()
  artists: string[];

  @IsNotEmpty()
  albums: string[];

  @IsNotEmpty()
  tracks: string[];
}
