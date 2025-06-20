export declare class User {
    readonly id: string;
    email: string;
    private passwordHash;
    private constructor();
    static create(id: string, email: string, hash: string): User;
}
