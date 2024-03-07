import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ErrorMessages } from 'src/utils/errors';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(id: string) {
    const UUID_REGEX =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (id.match(UUID_REGEX) === null) {
      throw new BadRequestException(ErrorMessages.INVALID_ID);
    }
    return id;
  }
}
