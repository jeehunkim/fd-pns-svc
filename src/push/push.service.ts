import { Injectable } from '@nestjs/common';
import { FirebaseService } from '@/firebase/firebase.service';
import { FirebasePushDto } from '@/model/dto/firebase.push.dto';

@Injectable()
export class PushService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async sendPush(payload: FirebasePushDto): Promise<any> {
    return this.firebaseService.sendPush(payload);
  }
}
