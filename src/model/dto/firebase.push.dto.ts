import { IsString } from 'class-validator';

export class FirebasePushDto {
  public readonly userId: number;

  @IsString()
  public readonly title: string;

  @IsString()
  public readonly body: string;

  public readonly data?: {
    [key: string]: string;
  };
}
