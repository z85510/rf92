import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserKafkaProducer } from '../../infrastructure/messaging/user.kafka-producer';
export declare class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    private repo;
    private producer;
    constructor(repo: UserRepository, producer: UserKafkaProducer);
    execute(cmd: CreateUserCommand): Promise<{
        id: string;
        email: string;
    }>;
}
