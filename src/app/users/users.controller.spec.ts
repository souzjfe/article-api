import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permission } from '../permissions/entities/permission.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const mockPermission: Permission = {
    id: 1,
    name: 'Reader',
    description: 'Reader',
    users: [],
  };

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'p',
    permission: mockPermission,
    articles: [],
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'John',
      email: 'j@j.com',
      password: '123',
    };
    mockUsersService.create.mockResolvedValue(mockUser);
    expect(await controller.create(dto)).toEqual(mockUser);
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should find all users', async () => {
    mockUsersService.findAll.mockResolvedValue([mockUser]);
    expect(await controller.findAll()).toEqual([mockUser]);
  });

  it('should find one user', async () => {
    mockUsersService.findOne.mockResolvedValue(mockUser);
    expect(await controller.findOne('1')).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'John Updated' };
    mockUsersService.update.mockResolvedValue({ ...mockUser, ...dto });
    expect(await controller.update('1', dto)).toEqual({ ...mockUser, ...dto });
  });

  it('should remove a user', async () => {
    mockUsersService.remove.mockResolvedValue(mockUser);
    expect(await controller.remove('1')).toEqual(mockUser);
  });
});
