import { ApiProperty } from '@nestjs/swagger';

export class JobOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  favicon: string;

  @ApiProperty()
  scriptUrls: string[];

  @ApiProperty()
  styleUrls: string[];

  @ApiProperty()
  imageUrls: string[];
}
