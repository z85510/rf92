import { IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { UserRepository } from '../../domain/repositories/user.repository';
export declare class GetUserHandler implements IQueryHandler<GetUserQuery> {
    private repo;
    constructor(repo: UserRepository);
    execute(q: GetUserQuery): Promise<import("../../domain/entities/user.entity").User>;
}
