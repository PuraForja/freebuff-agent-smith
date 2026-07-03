# 🧠 Skill: quarkus-security

> **Adaptada do ECC:** `quarkus-security` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/quarkus-security/SKILL.md`

## Descrição

Quarkus Security best practices for authentication, authorization, JWT/OIDC, RBAC, input validation, CSRF, secrets management, and dependency security.

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

# Quarkus Security Review

Best practices for securing Quarkus applications with authentication, authorization, and input validation.

## When to Activate

- Adding authentication (JWT, OIDC, Basic Auth)
- Implementing authorization with @RolesAllowed or SecurityIdentity
- Validating user input (Bean Validation, custom validators)
- Configuring CORS or security headers
- Managing secrets (Vault, environment variables, config sources)
- Adding rate limiting or brute-force protection
- Scanning dependencies for CVEs
- Working with MicroProfile JWT or SmallRye JWT

## Authentication

### JWT Authentication

```java
// Resource protected with JWT
@Path("/api/protected")
@Authenticated
public class ProtectedResource {

  @Inject
  JsonWebToken jwt;

  @Inject
  SecurityIdentity securityIdentity;

  @GET
  public Response getData() {
    String username = jwt.getName();
    Set<String> roles = jwt.getGroups();
    return Response.ok(Map.of(
        "username", username,
        "roles", roles,
        "principal", securityIdentity.getPrincipal().getName()
    )).build();
  }
}
```

Configuration (application.properties):
```properties
mp.jwt.verify.publickey.location=publicKey.pem
mp.jwt.verify.issuer=https://auth.example.com

# OIDC
quarkus.oidc.auth-server-url=https://auth.example.com/realms/myrealm
quarkus.oidc.client-id=backend-service
quarkus.oidc.credentials.secret=${OIDC_SECRET}
```

### Custom Authentication Filter

```java
@Provider
@Priority(Priorities.AUTHENTICATION)
public class CustomAuthFilter implements ContainerRequestFilter {

  @Inject
  SecurityIdentity identity;

  @Override
  public void filter(ContainerRequestContext requestContext) {
    String authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

    // Reject immediately if header is absent or malformed
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
      return;
    }

    String token = authHeader.substring(7);
    if (!validateToken(token)) {
      requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
    }
  }

  private boolean validateToken(String token) {
    // Token validation logic
    return true;
  }
}
```

## Authorization

### Role-Based Access Control

```java
@Path("/api/admin")
@RolesAllowed("ADMIN")
public class AdminResource {

  @GET
  @Path("/users")
  public List<UserDto> listUsers() {
    return userService.findAll();
  }

  @DELETE
  @Path("/users/{id}")
  @RolesAllowed({"ADMIN", "SUPER_ADMIN"})
  public Response deleteUser(@PathParam("id") Long id) {
    userService.delete(id);
    return Response.noContent().build();
  }
}

@Path("/api/users")
public class UserResource {

  @Inject
  SecurityIdentity securityIdentity;

  @GET
  @Path("/{id}")
  @RolesAllowed("USER")
  public Response getUser(@PathParam("id") Long id) {
    // Check ownership
    if (!securityIdentity.hasRole("ADMIN") &&
        !isOwne

---

**ECC Original:** `ECC/skills/quarkus-security/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:30
