import { ApiProperty } from '@nestjs/swagger';

export class JobResDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  data: object;

  @ApiProperty()
  opts: object;

  @ApiProperty()
  id: number;

  @ApiProperty()
  progress: number;

  @ApiProperty()
  returnvalue: object;

  @ApiProperty()
  stacktrace: string[];

  @ApiProperty()
  attemptsMade: number;

  @ApiProperty()
  delay: number;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  queueQualifiedName: string;

  @ApiProperty()
  finishedOn: number;

  @ApiProperty()
  processedOn: number;
}
