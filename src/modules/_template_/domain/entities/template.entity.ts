export class Template {
  private constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public tags: string[],
    public isActive: boolean,
    public readonly tenantId: string,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public updatedBy?: string,
  ) {}

  static create(
    id: string,
    name: string,
    description: string,
    tags: string[],
    tenantId: string,
    createdBy: string,
  ): Template {
    // Domain invariants validation
    if (!name || name.trim().length === 0) {
      throw new Error('Template name cannot be empty');
    }
    
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    if (!createdBy) {
      throw new Error('Creator ID is required');
    }

    const now = new Date();
    return new Template(
      id,
      name.trim(),
      description?.trim() || '',
      tags || [],
      true,
      tenantId,
      createdBy,
      now,
      now,
    );
  }

  update(
    name?: string,
    description?: string,
    tags?: string[],
    isActive?: boolean,
    updatedBy?: string,
  ): void {
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new Error('Template name cannot be empty');
      }
      this.name = name.trim();
    }

    if (description !== undefined) {
      this.description = description?.trim() || '';
    }

    if (tags !== undefined) {
      this.tags = tags;
    }

    if (isActive !== undefined) {
      this.isActive = isActive;
    }

    this.updatedAt = new Date();
    this.updatedBy = updatedBy;
  }

  deactivate(updatedBy: string): void {
    this.isActive = false;
    this.updatedAt = new Date();
    this.updatedBy = updatedBy;
  }

  activate(updatedBy: string): void {
    this.isActive = true;
    this.updatedAt = new Date();
    this.updatedBy = updatedBy;
  }
}