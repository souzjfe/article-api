import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('articles')
@ApiBearerAuth()
@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Roles('Admin', 'Editor')
  @ApiOperation({ summary: 'Create article (Admin, Editor)' })
  create(
    @Request() req: { user: User },
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articlesService.create(createArticleDto, req.user);
  }

  @Get()
  @Roles('Admin', 'Editor', 'Reader')
  @ApiOperation({ summary: 'List all articles (All roles)' })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Editor', 'Reader')
  @ApiOperation({ summary: 'Get article by id (All roles)' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Admin', 'Editor')
  @ApiOperation({ summary: 'Update article (Admin, Editor)' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @Roles('Admin', 'Editor')
  @ApiOperation({ summary: 'Delete article (Admin, Editor)' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
