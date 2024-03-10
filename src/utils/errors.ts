export enum EntityName {
  USER = 'User',
  ALBUM = 'Album',
  ARTIST = 'Artist',
  TRACK = 'Track',
}

export enum EntityIdName {
  USER_ID = 'userId',
  ALBUM_ID = 'albumId',
  ARTIST_ID = 'artistId',
  TRACK_ID = 'trackId',
}

export const getNotFoundMsg = (entityName: string): string => {
  return `${entityName} was not found`;
};

export const getInvalidIdMsg = (entityId: string): string => {
  return `Bad request. ${entityId} is invalid (not uuid)`;
};

export const getNotExistMsg = (entityName: string): string => {
  return `${entityName} with id doesn't exist`;
};

export const getOldPassWrongMsg = (): string => {
  return `oldPassword is wrong`;
};
