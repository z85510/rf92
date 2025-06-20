import { PrismaService } from '../../../database/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, tenantId: string): Promise<UserResponseDto>;
    findOne(id: string, tenantId: string): Promise<UserResponseDto>;
    findAll(tenantId: string): Promise<UserResponseDto[]>;
    private mapToResponseDto;
}
