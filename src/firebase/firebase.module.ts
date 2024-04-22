import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebasePushHistory } from '@/model/entities/account/firebase.push.history.entity';
import { FirebaseUserToken } from '@/model/entities/account/firebase.user.token.entity';
import { UserAccountEntity } from '@/model/entities/account/user-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccountEntity, FirebasePushHistory, FirebaseUserToken])],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
