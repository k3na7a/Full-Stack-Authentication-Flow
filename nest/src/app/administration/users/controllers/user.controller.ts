import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from 'src/library/data/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { storage } from 'src/library/config/storage.config';
import { megabyte } from 'src/library/data/constants/size.constants';
import {
  UserPaginationOptions,
  UpdateUserDto,
} from 'src/app/users/dto/user.dto';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { Administrator } from '../../decorators/administrator.decorator';
import { UserAdminService } from '../services/users.service';

@ApiTags('Administration / User Management')
@Controller('users')
@Administrator()
@UseInterceptors(ClassSerializerInterceptor)
class UserAdminController {
  constructor(private readonly service: UserAdminService) {}

  @Get('')
  @ApiOkResponse({ type: PaginationDto<UserEntity> })
  async paginate(
    @Query() params: UserPaginationOptions,
  ): Promise<PaginationDto<UserEntity>> {
    return this.service.paginate(params);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * megabyte,
          }),
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|gif)',
          }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.service.update(id, dto, file);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async delete(@Param('id') id: string): Promise<UserEntity> {
    return this.service.remove(id);
  }
}

export { UserAdminController };
