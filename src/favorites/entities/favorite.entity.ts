export class Favorite {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids

  constructor(partial: Partial<Favorite>) {
    Object.assign(this, partial);
  }
}
