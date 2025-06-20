import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserKafkaProducer {
  constructor(@Inject('KAFKA') private kafka: ClientKafka) {}
  async publishUserCreated(user: User) {
    await this.kafka.emit('users.created', {
      key: user.id,
      value: { id: user.id, email: user.email },
    });
  }
}