import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permission } from '../permissions/entities/permission.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockPermission: Permission = {
    id: 3,
    name: 'Reader',
    description: 'Reader permission',
    users: [],
  };

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    permission: mockPermission,
    articles: [],
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  const mockPermissionsService = {
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockPermissionsService.findByName.mockResolvedValue(mockPermission);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(mockPermissionsService.findByName).toHaveBeenCalledWith('Reader');
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue(mockUser); // Simulates existing user

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create users with specific roles (Admin, Editor, Reader)', async () => {
      const roles = ['Admin', 'Editor', 'Reader'];

      for (const role of roles) {
        const dto: CreateUserDto = {
          name: `User ${role}`,
          email: `${role}@test.com`,
          password: '123',
          permissionName: role,
        };

        const rolePermission = { ...mockPermission, name: role };
        mockPermissionsService.findByName.mockResolvedValue(rolePermission);
        mockRepository.findOne.mockResolvedValue(null); // Ensure no conflict
        mockRepository.create.mockReturnValue({
          ...mockUser,
          permission: rolePermission,
        });
        mockRepository.save.mockResolvedValue({
          ...mockUser,
          permission: rolePermission,
        });

        const result = await service.create(dto);

        expect(mockPermissionsService.findByName).toHaveBeenCalledWith(role);
        expect(result.permission.name).toBe(role);
      }
    });

    it('should create a user with invalid permission name falling back to Reader', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        permissionName: 'Invalid',
      };

      mockPermissionsService.findByName
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockPermission);

      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      await service.create(createUserDto);
      expect(mockPermissionsService.findByName).toHaveBeenCalledWith('Invalid');
      expect(mockPermissionsService.findByName).toHaveBeenCalledWith('Reader');
    });

    it('should throw NotFoundException if fallback Reader permission missing', async () => {
      const createUserDto: CreateUserDto = {
        name: 'J',
        email: 'e',
        password: 'p',
        permissionName: 'Inv',
      };
      mockPermissionsService.findByName.mockResolvedValue(null);
      await expect(service.create(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockUser });
      mockRepository.save.mockImplementation((user) => Promise.resolve(user));

      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const result = await service.update(1, updateUserDto);

      expect(result.name).toEqual('Updated Name');
    });

    it('should update password and permission', async () => {
      const user = { ...mockUser };
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.save.mockImplementation((u) => Promise.resolve(u));
      const newPerm = { ...mockPermission, name: 'NewPerm' };
      mockPermissionsService.findByName.mockResolvedValue(newPerm);

      const updateUserDto: UpdateUserDto = {
        password: 'newpass',
        permissionName: 'NewPerm',
      };
      await service.update(1, updateUserDto);

      expect(user.permission.name).toBe('NewPerm');
    });

    it('should not update permission if not found', async () => {
      const user = { ...mockUser };
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.save.mockImplementation((u) => Promise.resolve(u));
      mockPermissionsService.findByName.mockResolvedValue(null);

      const updateUserDto: UpdateUserDto = { permissionName: 'InvalidPerm' };
      await service.update(1, updateUserDto);

      expect(user.permission.name).toBe('Reader');
    });

    it('should throw ConflictException if updating to an existing email', async () => {
      const user = { ...mockUser };
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.findOne.mockResolvedValueOnce(user); // findOne for the update call
      // Next call is findByEmail inside update logic
      mockRepository.findOne.mockResolvedValueOnce({
        ...mockUser,
        id: 2,
        email: 'exists@test.com',
      });

      const updateUserDto: UpdateUserDto = { email: 'exists@test.com' };
      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove(1);
      expect(result).toEqual(mockUser);
    });
  });
});
