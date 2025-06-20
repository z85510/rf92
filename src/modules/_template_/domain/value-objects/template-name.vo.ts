export class TemplateName {
  private constructor(private readonly value: string) {}

  static create(name: string): TemplateName {
    if (!name || typeof name !== 'string') {
      throw new Error('Template name must be a non-empty string');
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      throw new Error('Template name cannot be empty');
    }

    if (trimmedName.length > 100) {
      throw new Error('Template name cannot exceed 100 characters');
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      throw new Error('Template name can only contain letters, numbers, spaces, hyphens, and underscores');
    }

    return new TemplateName(trimmedName);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TemplateName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}