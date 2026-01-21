import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  const mockUser: User = {
    id: 1,
    name: 'Author',
    email: 'a@a.com',
    password: 'p',
    permission: { id: 1, name: 'Admin', description: 'Admin', users: [] },
    articles: [],
  };

  const mockArticle: Article = {
    id: 1,
    title: 'Test',
    content: { text: 'Content' },
    author: mockUser,
  };

  const mockArticlesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create article', async () => {
    const dto: CreateArticleDto = { title: 'T', content: { text: 'C' } };
    const req = { user: mockUser };
    mockArticlesService.create.mockResolvedValue(mockArticle);

    expect(await controller.create(req, dto)).toEqual(mockArticle);
    expect(mockArticlesService.create).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should return all articles', async () => {
    mockArticlesService.findAll.mockResolvedValue([mockArticle]);
    expect(await controller.findAll()).toEqual([mockArticle]);
  });
});
