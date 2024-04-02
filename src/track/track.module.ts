import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DBModule } from 'src/db/db.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
  imports: [DBModule],
})
export class TrackModule {}
