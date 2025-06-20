export class GetTemplateQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}

export class GetTemplatesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly isActive?: boolean,
    public readonly tags?: string[],
  ) {}
}