import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(100)
  limit: number = 100;
}
