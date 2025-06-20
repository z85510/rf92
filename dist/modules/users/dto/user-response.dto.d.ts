export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    roles: string[];
    isActive: boolean;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaginatedUsersResponseDto {
    data: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
