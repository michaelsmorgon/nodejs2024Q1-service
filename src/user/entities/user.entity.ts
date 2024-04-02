import { Exclude } from 'class-transformer';

export class User {
  id: string;
  login: string;

  @Exclude()
  password?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
