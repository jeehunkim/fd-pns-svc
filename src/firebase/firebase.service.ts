import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebasePushHistory } from '@/model/entities/account/firebase.push.history.entity';
import { FirebaseUserToken } from '@/model/entities/account/firebase.user.token.entity';
import { UserAccountEntity } from '@/model/entities/account/user-account.entity';
import { SendPushResponse } from '@/model/types';
import { Repository } from 'typeorm';
import * as firebase from 'firebase-admin';
import { readFile } from 'fs/promises';
import { FirebasePushDto } from '@/model/dto/firebase.push.dto';
import { TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseService {
  constructor(
    @InjectRepository(UserAccountEntity) private readonly userRepo: Repository<UserAccountEntity>,
    @InjectRepository(FirebasePushHistory) private readonly historyRepo: Repository<FirebasePushHistory>,
    @InjectRepository(FirebaseUserToken) private readonly tokenRepo: Repository<FirebaseUserToken>,
  ) {}

  sendPush = async (payload: FirebasePushDto): Promise<SendPushResponse> => {
    try {
      const { userId, data } = payload;
      const userInfo: UserAccountEntity = await this.userRepo.findOne({ where: { id: userId } });

      // data: {key: 'video', value: 'shorts'}
      if (!userInfo) {
        return {
          result: 'fail',
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
          data: [{ error: HttpStatus.NOT_FOUND.toString() }],
        };
      }

      if (!userInfo.pushreceive) {
        return {
          result: 'fail',
          status: HttpStatus.BAD_REQUEST,
          message: 'pushreceive is not allowed',
          data: [{ error: HttpStatus.BAD_REQUEST.toString() }],
        };
      }

      const tokenCheck = await this.tokenRepo.findOne({
        where: { userId: userInfo.id },
      });

      if (!tokenCheck) {
        return {
          result: 'fail',
          status: HttpStatus.BAD_REQUEST,
          message: 'user token is empty',
          data: [{ error: HttpStatus.BAD_REQUEST.toString() }],
        };
      }

      const firebaseServiceAccountFile = await readFile('./src/config/firebaseServiceAccountKey.json', 'utf8');
      const certAccount = await JSON.parse(firebaseServiceAccountFile);

      if (!firebase.apps.length) {
        firebase.initializeApp({
          credential: firebase.credential.cert(certAccount),
        });
      }

      let status = true;
      let resultString = 'success';
      let resultStatus = HttpStatus.OK;
      let resultMessage = 'pushreceive send';

      const sendMsg: TokenMessage = {
        data,
        token: tokenCheck.deviceToken,
        android: {
          priority: 'high',
        },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
            },
          },
        },
      };

      await firebase
        .messaging()
        .send(sendMsg)
        .then(async (res: any) => {
          if (res.failure > 0) {
            status = false;
            resultString = 'fail';
            resultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            resultMessage = res.results?.error;
          }
        })
        .catch((error) => {
          status = false;
          resultString = 'fail';
          resultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
          resultMessage = error?.errorInfo?.message;
        });

      const notiInfo = new FirebasePushHistory();
      notiInfo.userid = userId;
      notiInfo.title = '';
      const bodyData = JSON.stringify(data);
      notiInfo.body = bodyData;
      notiInfo.token = tokenCheck.deviceToken;
      notiInfo.status = status;
      notiInfo.failmessage = resultMessage;
      await this.historyRepo.save(notiInfo);

      return {
        result: resultString,
        status: resultStatus,
        message: resultMessage,
        data: [],
      };
    } catch (error) {
      return {
        result: 'fail',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL_SERVER_ERROR',
        data: [{ error }],
      };
    }
  };
}
