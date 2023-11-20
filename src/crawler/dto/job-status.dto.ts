import { ApiProperty } from '@nestjs/swagger';

export class JobStatusResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  progress: number;

  @ApiProperty()
  status: string;
}
