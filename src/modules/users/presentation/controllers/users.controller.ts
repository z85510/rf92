import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { GetUserQuery } from '../../application/queries/get-user.query';

@Controller('users')
export class UsersController {
  constructor(private cmd: CommandBus, private qry: QueryBus) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.cmd.execute(new CreateUserCommand(body));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qry.execute(new GetUserQuery(id));
  }
}