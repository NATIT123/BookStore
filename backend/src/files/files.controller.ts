import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';
import { HttpExceptionFilter } from 'src/core/http-exception.filter';
import type { File as MulterFile } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // tên field sử dụng trong form-data
  @UseFilters(new HttpExceptionFilter()) // Handle exception filter with only file resource
  @ResponseMessage('Upload a single file')
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: MulterFile,
  ) {
    return {
      fileName: file.filename,
    };
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
