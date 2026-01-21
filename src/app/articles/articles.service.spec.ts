import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;

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
    title: 'Test Article',
    content: { text: 'Content' },
    author: mockUser,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const dto: CreateArticleDto = {
        title: 'Test',
        content: { text: 'Content' },
      };

      mockRepository.create.mockReturnValue(mockArticle);
      mockRepository.save.mockResolvedValue(mockArticle);

      const result = await service.create(dto, mockUser);
      expect(result).toEqual(mockArticle);
    });
  });

  describe('findAll', () => {
    it('should return array of articles', async () => {
      mockRepository.find.mockResolvedValue([mockArticle]);
      const result = await service.findAll();
      expect(result).toEqual([mockArticle]);
    });
  });

  describe('findOne', () => {
    it('should return an article', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockArticle);
      const result = await service.findOne(1);
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
