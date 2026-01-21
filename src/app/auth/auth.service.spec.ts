import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockPermission: Permission = {
    id: 1,
    name: 'Reader',
    description: 'Desc',
    users: [],
  };

  const mockUser: User = {
    id: 1,
    name: 'Test',
    email: 'test@test.com',
    password: 'hashedpassword',
    permission: mockPermission,
    articles: [],
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if validation succeeds', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      jest
        .spyOn(bcrypt, 'compare')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser('test@test.com', 'password');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...expected } = mockUser;
      expect(result).toMatchObject(expected);
    });

    it('should return null if validation fails', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      jest
        .spyOn(bcrypt, 'compare')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser(
        'test@test.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token with correct permissions', () => {
      mockJwtService.sign.mockReturnValue('token');
      service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          permission: 'Reader',
        }),
      );
    });
  });
});
