import { ClientKafka } from '@nestjs/microservices';
import { User } from '../../domain/entities/user.entity';
export declare class UserKafkaProducer {
    private kafka;
    constructor(kafka: ClientKafka);
    publishUserCreated(user: User): Promise<void>;
}
