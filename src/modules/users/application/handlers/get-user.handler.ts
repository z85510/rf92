import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserQuery } from '../queries/get-user.query';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}
  async execute(q: GetUserQuery) {
    return this.repo.findById(q.id);
  }
}