export class User {
  private constructor(
    public readonly id: string,
    public email: string,
    private passwordHash: string,
  ) {}

  static create(id: string, email: string, hash: string) {
    // domain invariants here
    return new User(id, email, hash);
  }
}