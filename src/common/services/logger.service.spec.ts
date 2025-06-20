import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
    
    // Spy on console methods
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('log', () => {
    it('should log a message with context', () => {
      const message = 'Test message';
      const context = { userId: '123', action: 'test' };

      service.log(message, context);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should log a message without context', () => {
      const message = 'Test message';

      service.log(message);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });
  });

  describe('error', () => {
    it('should log an error message with trace and context', () => {
      const message = 'Error message';
      const trace = 'Error stack trace';
      const context = { userId: '123', action: 'test' };

      service.error(message, trace, context);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });

    it('should log an error message without trace', () => {
      const message = 'Error message';

      service.error(message);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });
  });

  describe('warn', () => {
    it('should log a warning message with context', () => {
      const message = 'Warning message';
      const context = { userId: '123', warning: 'Potential issue' };

      service.warn(message, context);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );
    });
  });

  describe('debug', () => {
    it('should log a debug message with context in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const message = 'Debug message';
      const context = { userId: '123', debug: 'Debug info' };

      service.debug(message, context);

      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining(message)
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug message in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const message = 'Debug message';
      const context = { userId: '123', debug: 'Debug info' };

      service.debug(message, context);

      expect(console.debug).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });
});