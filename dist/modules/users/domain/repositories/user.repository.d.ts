import { User } from '../entities/user.entity';
export declare const USER_REPOSITORY: unique symbol;
export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
}
