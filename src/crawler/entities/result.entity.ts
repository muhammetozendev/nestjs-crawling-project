import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  favicon: string;

  @Column()
  @Index()
  jobId: string;

  @OneToMany(() => Url, (url) => url.result)
  urls: Url[];
}
