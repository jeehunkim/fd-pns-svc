import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { FirebaseModule } from '@/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [PushService],
  controllers: [PushController],
})
export class PushModule {}
