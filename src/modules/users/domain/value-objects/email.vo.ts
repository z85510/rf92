export class Email {
  private constructor(public readonly value: string) {}
  static of(raw: string): Email {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw))
      throw new Error('Invalid email');
    return new Email(raw.toLowerCase());
  }
}