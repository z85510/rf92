# Domain Layer

The **Domain Layer** is the heart of the application containing the business logic, entities, and domain rules. This layer represents the core business concepts and is independent of any external concerns.

## 🎯 Purpose

- Contains the business entities and their behavior
- Defines domain rules and invariants
- Establishes contracts through repository interfaces
- Implements value objects for type safety and validation
- Represents the ubiquitous language of the business domain

## 📁 Structure

```
domain/
├── entities/                  # Business entities with behavior
│   └── template.entity.ts
├── repositories/             # Repository contracts (interfaces)
│   └── template.repository.ts
└── value-objects/           # Value objects for validation and type safety
    └── template-name.vo.ts
```

## 🏛️ Domain-Driven Design

This layer follows **Domain-Driven Design (DDD)** principles:

### Entities
Rich objects that have identity and contain business logic:

```typescript
export class Template {
  private constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    // ... other properties
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
    
    // Business logic for creation
    return new Template(/* ... */);
  }

  update(name?: string, description?: string): void {
    // Business logic for updates
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new Error('Template name cannot be empty');
      }
      this.name = name.trim();
    }
    // ... update logic
  }
}
```

**Characteristics:**
- Have unique identity (ID)
- Contain business behavior (methods)
- Enforce business rules
- Encapsulate data and behavior
- Immutable where possible

### Value Objects
Immutable objects that represent concepts without identity:

```typescript
export class TemplateName {
  private constructor(private readonly value: string) {}

  static create(name: string): TemplateName {
    // Validation logic
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

    return new TemplateName(trimmedName);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TemplateName): boolean {
    return this.value === other.value;
  }
}
```

**Characteristics:**
- No identity (compared by value)
- Immutable
- Self-validating
- Type-safe alternatives to primitives

### Repository Interfaces
Contracts for data access without implementation details:

```typescript
export const TEMPLATE_REPOSITORY = Symbol('TEMPLATE_REPOSITORY');

export interface TemplateRepository {
  findById(id: string, tenantId: string): Promise<Template | null>;
  findByName(name: string, tenantId: string): Promise<Template | null>;
  findAll(tenantId: string, isActive?: boolean): Promise<Template[]>;
  save(template: Template): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
}
```

**Characteristics:**
- Define contracts, not implementations
- Use domain entities as parameters/return types
- Abstract away persistence concerns
- Enable dependency inversion

## 📝 Responsibilities

### ✅ What This Layer Does
- **Defines business entities** with their behavior
- **Enforces business rules** and invariants
- **Validates domain logic** through value objects
- **Establishes data contracts** via repository interfaces
- **Encapsulates business complexity** in domain objects
- **Provides ubiquitous language** for the business domain

### ❌ What This Layer Doesn't Do
- **Database access** (that's infrastructure's job)
- **HTTP handling** (that's presentation's job)
- **External API calls** (that's infrastructure's job)
- **Framework-specific code** (stays framework-agnostic)

## 🔄 Entity Lifecycle

```
Creation → Validation → Business Logic → Persistence
    ↓           ↓             ↓              ↓
Static      Value Objects  Entity Methods  Repository
Factory     Validation    Behavior        Interface
```

## 🛡️ Business Rules Examples

### Domain Invariants
Rules that must always be true:

```typescript
// Template must have a name
if (!name || name.trim().length === 0) {
  throw new Error('Template name cannot be empty');
}

// Template must belong to a tenant
if (!tenantId) {
  throw new Error('Tenant ID is required');
}

// Only active templates can be updated
if (!this.isActive) {
  throw new Error('Cannot update inactive template');
}
```

### Business Logic
Domain-specific behavior:

```typescript
deactivate(updatedBy: string): void {
  if (!this.isActive) {
    throw new Error('Template is already inactive');
  }
  
  this.isActive = false;
  this.updatedAt = new Date();
  this.updatedBy = updatedBy;
}

addTag(tag: string): void {
  if (this.tags.includes(tag)) {
    throw new Error('Tag already exists');
  }
  
  if (this.tags.length >= 10) {
    throw new Error('Maximum 10 tags allowed');
  }
  
  this.tags.push(tag);
}
```

## 🧪 Testing

### Entity Testing
```typescript
describe('Template Entity', () => {
  describe('create', () => {
    it('should create template with valid data', () => {
      // Arrange
      const id = 'test-id';
      const name = 'Test Template';
      const description = 'Test Description';
      
      // Act
      const template = Template.create(id, name, description, [], 'tenant-1', 'user-1');
      
      // Assert
      expect(template.id).toBe(id);
      expect(template.name).toBe(name);
      expect(template.isActive).toBe(true);
    });

    it('should throw error for empty name', () => {
      // Act & Assert
      expect(() => {
        Template.create('id', '', 'desc', [], 'tenant-1', 'user-1');
      }).toThrow('Template name cannot be empty');
    });
  });

  describe('update', () => {
    it('should update name', () => {
      // Arrange
      const template = Template.create('id', 'Original', 'desc', [], 'tenant-1', 'user-1');
      
      // Act
      template.update('Updated Name');
      
      // Assert
      expect(template.name).toBe('Updated Name');
    });
  });
});
```

### Value Object Testing
```typescript
describe('TemplateName', () => {
  it('should create valid template name', () => {
    // Act
    const templateName = TemplateName.create('Valid Name');
    
    // Assert
    expect(templateName.getValue()).toBe('Valid Name');
  });

  it('should throw error for invalid name', () => {
    // Act & Assert
    expect(() => TemplateName.create('')).toThrow();
    expect(() => TemplateName.create('a'.repeat(101))).toThrow();
  });

  it('should compare by value', () => {
    // Arrange
    const name1 = TemplateName.create('Test');
    const name2 = TemplateName.create('Test');
    
    // Assert
    expect(name1.equals(name2)).toBe(true);
  });
});
```

## 🔗 Dependencies

### Inward Dependencies (From)
- **Application Layer**: Uses entities and repository interfaces
- **Infrastructure Layer**: Implements repository interfaces

### Outward Dependencies (To)
- **None** - This layer should be independent and not depend on other layers

## 📋 Best Practices

1. **Rich entities** - Put business logic in entities, not services
2. **Immutable value objects** - Create new instances rather than modifying
3. **Validate at creation** - Use factory methods for validation
4. **Express domain language** - Use business terminology in code
5. **Encapsulate behavior** - Don't expose internal state directly
6. **Small value objects** - Create focused, single-purpose value objects
7. **Domain exceptions** - Use specific exceptions for business rule violations

## 🚀 Adding New Domain Concepts

### Adding a New Entity
```typescript
export class NewEntity {
  private constructor(/* properties */) {}

  static create(/* parameters */): NewEntity {
    // Validation and business rules
    return new NewEntity(/* ... */);
  }

  // Business methods
  performBusinessOperation(): void {
    // Business logic here
  }
}
```

### Adding a New Value Object
```typescript
export class NewValueObject {
  private constructor(private readonly value: SomeType) {}

  static create(input: SomeType): NewValueObject {
    // Validation logic
    return new NewValueObject(input);
  }

  getValue(): SomeType {
    return this.value;
  }

  equals(other: NewValueObject): boolean {
    return this.value === other.value;
  }
}
```

### Adding Repository Methods
```typescript
export interface TemplateRepository {
  // Existing methods...
  findByNewCriteria(criteria: SomeCriteria): Promise<Template[]>;
  countByStatus(status: Status): Promise<number>;
}
```

## 🎯 Domain Events (Future Enhancement)

Consider adding domain events for complex business scenarios:

```typescript
export class TemplateCreatedEvent {
  constructor(
    public readonly templateId: string,
    public readonly tenantId: string,
    public readonly createdBy: string,
    public readonly occurredAt: Date,
  ) {}
}

// In entity
private events: DomainEvent[] = [];

static create(/* ... */): Template {
  const template = new Template(/* ... */);
  template.addEvent(new TemplateCreatedEvent(/* ... */));
  return template;
}
```

This would allow for eventual consistency and integration with other bounded contexts.