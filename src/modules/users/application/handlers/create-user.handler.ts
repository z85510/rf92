import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserKafkaProducer } from '../../infrastructure/messaging/user.kafka-producer';
import * as bcrypt from 'bcryptjs';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private repo: UserRepository,
    private producer: UserKafkaProducer,
  ) {}

  async execute(cmd: CreateUserCommand) {
    const hash = await bcrypt.hash(cmd.data.password, 10);
    const user = User.create(randomUUID(), cmd.data.email, hash);
    await this.repo.save(user);
    await this.producer.publishUserCreated(user);
    return { id: user.id, email: user.email };
  }
}