# 🧠 Skill: nestjs-patterns

> **Adaptada do ECC:** `nestjs-patterns` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/nestjs-patterns/SKILL.md`

## Descrição

NestJS architecture patterns for modules, controllers, providers, DTO validation, guards, interceptors, config, and production-grade TypeScript backends.

---

## ⚠️ Adaptação para Codebuff



| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# NestJS Development Patterns

Production-grade NestJS patterns for modular TypeScript backends.

## When to Activate

- Building NestJS APIs or services
- Structuring modules, controllers, and providers
- Adding DTO validation, guards, interceptors, or exception filters
- Configuring environment-aware settings and database integrations
- Testing NestJS units or HTTP endpoints

## Project Structure

```text
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   ├── configuration.ts
│   └── validation.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   └── users/
│       ├── dto/
│       ├── entities/
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
└── prisma/ or database/
```

- Keep domain code inside feature modules.
- Put cross-cutting filters, decorators, guards, and interceptors in `common/`.
- Keep DTOs close to the module that owns them.

## Bootstrap and Global Validation

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

- Always enable `whitelist` and `forbidNonWhitelisted` on public APIs.
- Prefer one global validation pipe instead of repeating validation config per route.

## Modules, Controllers, and Providers

```ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(dto: CreateUserDto) {
    return this.usersRepo.create(dto);
  }
}
```

- Controllers should stay thin: parse HTTP input, call a provider, return response DTOs.
- Put business logic in injectable services, not controllers.
- Export only the providers other modules genuinely need.

## DTOs and Validation

```ts
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(2, 80)
  name!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
```

- Validate every request DTO with `class-validator`.
- Use dedicated response DTOs 

---

**ECC Original:** `ECC/skills/nestjs-patterns/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28
