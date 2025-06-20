import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { CreateUserDto } from '../../dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const mockQueryBus = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should execute CreateUserCommand with correct data', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedResult = {
        id: 'user-123',
        email: createUserDto.email,
      };

      commandBus.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateUserCommand)
      );
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          data: createUserDto,
        })
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate command bus errors', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const error = new Error('Command execution failed');
      commandBus.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createUserDto)).rejects.toThrow(
        'Command execution failed'
      );
    });
  });

  describe('findOne', () => {
    it('should execute GetUserQuery with correct id', async () => {
      // Arrange
      const userId = 'user-123';
      const expectedResult = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      queryBus.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findOne(userId);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetUserQuery)
      );
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: userId,
        })
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate query bus errors', async () => {
      // Arrange
      const userId = 'user-123';
      const error = new Error('User not found');
      queryBus.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(userId)).rejects.toThrow('User not found');
    });
  });
});