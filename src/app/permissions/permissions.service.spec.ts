import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';

describe('PermissionsService', () => {
  let service: PermissionsService;

  const mockPermission: Permission = {
    id: 1,
    name: 'Admin',
    description: 'Admin permission',
    users: [],
  };

  const mockRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    service = module.get<PermissionsService>(PermissionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByName', () => {
    it('should return a permission by name', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPermission);

      const result = await service.findByName('Admin');
      expect(result).toEqual(mockPermission);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ name: 'Admin' });
    });
  });
});
