import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
export declare class UsersController {
    private cmd;
    private qry;
    constructor(cmd: CommandBus, qry: QueryBus);
    create(body: CreateUserDto): Promise<any>;
    findOne(id: string): Promise<any>;
}
