import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserHandler } from './create-user.handler';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserKafkaProducer } from '../../infrastructure/messaging/user.kafka-producer';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let kafkaProducer: jest.Mocked<UserKafkaProducer>;

  beforeEach(async () => {
    const mockUserRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByTenant: jest.fn(),
    };

    const mockKafkaProducer = {
      publishUserCreated: jest.fn(),
      publishUserUpdated: jest.fn(),
      publishUserDeleted: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: UserKafkaProducer,
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();

    handler = module.get<CreateUserHandler>(CreateUserHandler);
    userRepository = module.get(USER_REPOSITORY);
    kafkaProducer = module.get(UserKafkaProducer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const commandData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        tenantId: 'tenant-123',
      };
      
      const command = new CreateUserCommand(commandData);
      const hashedPassword = 'hashed_password_123';
      
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      userRepository.save.mockResolvedValue(undefined);
      kafkaProducer.publishUserCreated.mockResolvedValue(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(commandData.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.any(User)
      );
      expect(kafkaProducer.publishUserCreated).toHaveBeenCalledWith(
        expect.any(User)
      );
      
      expect(result).toEqual({
        id: expect.any(String),
        email: commandData.email,
      });
    });

    it('should handle repository errors', async () => {
      // Arrange
      const commandData = {
        email: 'test@example.com',
        password: 'password123',
        tenantId: 'tenant-123',
      };
      
      const command = new CreateUserCommand(commandData);
      const hashedPassword = 'hashed_password_123';
      
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      userRepository.save.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Database error');
      expect(kafkaProducer.publishUserCreated).not.toHaveBeenCalled();
    });

    it('should handle Kafka publishing errors gracefully', async () => {
      // Arrange
      const commandData = {
        email: 'test@example.com',
        password: 'password123',
        tenantId: 'tenant-123',
      };
      
      const command = new CreateUserCommand(commandData);
      const hashedPassword = 'hashed_password_123';
      
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      userRepository.save.mockResolvedValue(undefined);
      kafkaProducer.publishUserCreated.mockRejectedValue(new Error('Kafka error'));

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Kafka error');
    });
  });
});