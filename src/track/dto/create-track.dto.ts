import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((o, value) => {
    return value === null || value;
  })
  artistId: string | null;

  @ValidateIf((o, value) => {
    return value === null || value;
  })
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
