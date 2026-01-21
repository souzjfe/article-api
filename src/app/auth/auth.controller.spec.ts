import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return token on login', async () => {
    const loginDto: LoginDto = { email: 'test@test.com', password: '123' };
    const user = { id: 1, email: 'test@test.com' } as User;
    const result = { access_token: 'jwt_token' };

    mockAuthService.login.mockResolvedValue(result);
    mockAuthService.validateUser.mockResolvedValue(user);

    expect(await controller.login(loginDto)).toEqual(result);
  });
});
