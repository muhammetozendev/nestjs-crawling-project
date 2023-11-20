import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UrlTypeEnum } from '../enums/url-type.enum';
import { Result } from './result.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UrlTypeEnum })
  type: UrlTypeEnum;

  @Column()
  url: string;

  @ManyToOne(() => Result, (result) => result.urls)
  result: Result;
}
