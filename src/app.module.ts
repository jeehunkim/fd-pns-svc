import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig = require('./config/ormconfig');
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { PushService } from './push/push.service';
import { PushModule } from './push/push.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig[0]),
    FirebaseModule,
    PushModule,
  ],
  controllers: [AppController],
  providers: [AppService, PushService],
})
export class AppModule {}
