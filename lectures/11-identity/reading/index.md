# 11 Identity, Credentials, and Session Establishment

This is the primary reading for the Identity, Credentials, and Session Establishment lecture in COMPSCI 326 Web Programming. In the [last reading](./10-orm.md), we focused on persistence boundaries, repository contracts, and keeping behavior consistent across in-memory and Prisma-backed implementations. In this chapter, we keep that same architectural model and apply it to request continuity in web applications.

This chapter is written for students who may be seeing session architecture for the first time. You should not feel pressure to already know all of the HTTP and cookie details. We will build from first principles, then move into practical Express implementation with the same boundary style you have seen before.

If you remember one sentence from this chapter, remember this: HTTP does not remember users for you, so continuity must be established intentionally and verified carefully.

## 1. Why This Topic Matters

Most web apps are not one-request systems. Users load pages, submit forms, refresh, click links, open new tabs, and return later. If your app cannot connect these requests to a stable continuity context, the app feels inconsistent or broken. The same user appears “new” on every request, actions lose context, and workflow state becomes unreliable.

Sessions solve this continuity problem at the application boundary. They let the server treat a sequence of requests as part of one ongoing interaction context.

Mini scenario: a student opens the journal app, writes a draft entry title, clicks to a second page, and comes back. Without continuity, the app has no trustworthy way to know whether this is the same browser context and the same in-progress workflow.

This chapter focuses on session establishment and management. The next lecture builds on this and covers authentication and authorization directly. In other words, today is continuity mechanics. Next is identity proof and access policy.

## 2. Core Vocabulary and Mental Model

Before writing code, we need precise vocabulary.

Identity is the subject the system believes it is interacting with. This might be a user account, an admin account, or some other subject type.

Credentials are evidence presented to support an identity claim, such as a password or one-time code.

A session is continuity state recognized by the server across requests. A client usually does not carry all session data. Instead, it carries a session identifier that maps to server-side session state.

A session identifier is an opaque token. It should not expose internal meaning and should not be used as a substitute for user identity itself.

A session store is where session records are kept. In small local setups this may be in-memory. In production-oriented systems, this is commonly durable/shared storage.

Session establishment is the process of creating session state and linking that state to the browser, usually with a cookie.

Keep this scope boundary explicit:

- Authentication asks: did this subject prove identity?
- Authorization asks: is this subject allowed to do this action?
- Session establishment asks: how do we maintain continuity across requests?

## 3. What HTTP Gives Us, and What It Does Not

HTTP is stateless by design. Each request is independent and contains enough information to be handled on its own. This property is useful for scalability and architectural simplicity. But it does not provide continuity by itself.

In practical terms, request A and request B are unrelated unless your application links them. Server process memory also does not solve continuity alone. If continuity lives only in memory, restart behavior can erase it.

So the key design question becomes: what continuity signal should the browser send, and what continuity state should the server store?

Mini scenario: browser A and browser B both request `/entries` at the same time. Without a continuity channel, the server has no principled way to tell whether these requests belong to the same person, different people, or a restarted context.

## 4. Browser-Side State Mechanisms and Their Limits

Students often ask whether the browser can hold continuity state by itself. The answer is “partly,” with important constraints.

Browsers can store values in cookies, local storage, and session storage. Cookies are specifically important in HTTP because they can be sent automatically on matching requests. Local storage and session storage are JavaScript-managed browser stores.

These mechanisms are useful tools, but they are not complete continuity architecture by themselves. If important continuity meaning lives only on the client, correctness and security become harder to guarantee. In most server-rendered app designs, the client carries a reference token and the server holds canonical continuity state.

Mini scenario: if the app stores all continuity meaning directly in local storage, a later request can include stale or manipulated context unless the server applies robust validation anyway. That tends to reintroduce server-side state logic, which is exactly why session design matters.

## 5. Session Architecture as a Two-Sided Channel

A working session system is a channel between browser and server.

The browser side is responsible for sending a continuity token on later requests. The server side is responsible for resolving that token, validating it, and applying lifecycle rules.

A typical lifecycle includes:

1. Create session record.
2. Send session ID to client.
3. Read/update session during subsequent requests.
4. Rotate/regenerate when needed.
5. Expire/destroy session.

This lifecycle is what turns independent HTTP requests into a continuity-aware interaction model.

## 6. Cookie Fundamentals for Sessions

Cookies are central to common session implementations.

`Set-Cookie` is sent by the server to store cookie state in the browser. `Cookie` is sent by the browser in later matching requests.

For sessions, cookie attributes are critical:

- `HttpOnly` reduces direct JavaScript access to the cookie.
- `Secure` limits sending to HTTPS.
- `SameSite` controls cross-site behavior.
- `Max-Age` / `Expires` define lifetime.
- `Path` / `Domain` define scope.

Common errors include insecure defaults, missing `HttpOnly`, and assuming that “cookie exists” means “session is valid.” Cookie presence is only a lookup hint. The server must verify session validity.

## 7. Session Identifier Design

Session identifiers should be opaque, high-entropy, and unpredictable. They are bearer tokens in practice: if someone captures a valid session ID, they may be able to reuse it.

Do not treat session IDs as user IDs. A single user may have multiple active sessions depending on policy and device/browser usage.

Session ID rotation/regeneration is important around sensitive transitions because it reduces fixation risk.

## 8. Session Storage Models

In-memory session storage is useful for local development because it is simple and fast. But it is volatile. Restarting the process clears session state.

Durable/shared storage supports continuity across restart and better supports multi-instance architecture. In this course sequence, we use Prisma-backed storage as the durable path while preserving repository contracts.

The design principle from previous lectures still applies: storage implementation can change, but contract behavior should remain stable.

## 9. Journal App Integration Roadmap

All implementation examples in this chapter should follow the journal app boundary style you used in class and in Homework 02.

Keep route -> controller -> service -> repository boundaries clear. Keep explicit `Result` and typed error mapping in place.

Session integration roadmap:

1. Add session model and repository contract.
2. Implement in-memory session repository first.
3. Add middleware and request-context wiring.
4. Add Prisma-backed session model and repository.
5. Keep route/controller/service behavior stable while switching session storage mode.

This is the same architecture discipline you already practiced for entry persistence.

## 10. Express Sessions: Practical Setup

At Express level, session work usually starts as middleware. Middleware runs before route handlers and can attach continuity context to the request path.

A minimal setup with `express-session` looks like this:

```ts
import session from 'express-session'

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'dev-only-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    },
  }),
)
```

In journal-app style, this does not replace your existing controller/service/repository boundaries. It provides continuity context that your existing boundaries consume.

Code walkthrough notes:

`secret` signs session identifiers so the server can verify integrity assumptions. `resave: false` avoids unnecessary rewrites when no session state changed. `saveUninitialized: false` avoids creating session records before they are needed. The `cookie` object defines delivery and safety behavior: `httpOnly` limits script-level access, `secure` ties transport behavior to environment, and `sameSite` gives a baseline CSRF defense posture.

## 11. Session Establishment Flow in Express

Before the full authentication lecture, we can still define the establishment flow clearly.

A request reaches a route that should establish continuity. The service creates a new session record with required fields and lifecycle rules. The controller returns response plus session cookie. Later requests present that cookie, and middleware resolves it to session context. Logout destroys session state and ends continuity.

Controller-style example:

```ts
async establishSession(res: Response, userId: number): Promise<void> {
  const created = await this.sessionService.establish({ userId })
  if (!created.ok) {
    res.status(500).render('entries/partials/error', { message: created.value.message })
    return
  }

  res.cookie('sid', created.value.sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  res.redirect('/entries')
}
```

Code walkthrough notes:

This method follows the same class pattern from the journal app: the controller does orchestration and response mapping, not storage details. `sessionService.establish` is where lifecycle rules live. On failure, the controller maps typed failure to a rendered error response. On success, it writes the continuity cookie and returns a normal redirect. This mirrors the explicit `Result` flow used elsewhere in the app.

## 12. Implementing In-Memory Sessions First

Start with in-memory mode to validate behavior quickly.

Define a contract first:

```ts
export type SessionRecord = {
  id: string
  userId: number
  createdAt: string
  expiresAt: string
}

export interface ISessionRepository {
  create(userId: number, ttlSeconds: number): Promise<Result<SessionRecord, SessionError>>
  getById(sessionId: string): Promise<Result<SessionRecord, SessionError>>
  destroy(sessionId: string): Promise<Result<void, SessionError>>
}
```

An in-memory implementation can use a `Map<string, SessionRecord>`, enforce expiry on read, and return typed `Err(...)` values for not-found/expired/invalid states.

Why this phase matters: you can verify lifecycle logic and error mapping before introducing database details.

Mini scenario: during development, you establish a session and then restart the server. If continuity disappears, that is expected in memory mode and confirms why durable storage is needed for production-like behavior.

## 13. Implementing Prisma-Backed Session Storage

After behavior is clear, move to durable storage with Prisma.

### 13.1 Schema direction

```prisma
model Session {
  id         String   @id
  userId     Int
  createdAt  DateTime @default(now())
  expiresAt  DateTime
  lastSeenAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}
```

If your app has a `User` model, add the relation explicitly.

### 13.2 Migration/update cycle

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 13.3 Repository behavior

Prisma repository methods should match the same session contract as memory mode and map storage failures into typed dependency errors.

```ts
async getById(id: string): Promise<Result<SessionRecord, SessionError>> {
  try {
    const row = await this.prisma.session.findUnique({ where: { id } })
    if (!row) return Err(SessionNotFound('Session not found.'))

    if (row.expiresAt.getTime() <= Date.now()) {
      return Err(SessionExpired('Session expired.'))
    }

    return Ok({
      id: row.id,
      userId: row.userId,
      createdAt: row.createdAt.toISOString(),
      expiresAt: row.expiresAt.toISOString(),
    })
  } catch {
    return Err(SessionDependencyError('Session DB read failed.'))
  }
}
```

### 13.4 Mode switching

Use composition-root switching (for example `SESSION_MODE=memory|prisma`) so route/controller code does not change when storage implementation changes.

Code walkthrough notes:

The repository method first performs a precise lookup by session ID, then applies the expiration invariant before returning success. The order matters. Existence is checked first, expiry is checked second, and only then is app-level shape returned. Any database error is mapped into a typed dependency failure so controllers can keep consistent response behavior without leaking Prisma-specific errors.

## 14. Correctness and Session Invariants

Session correctness should be defined as invariants before implementation.

Recommended notation:

`INV-<n>: IF <condition>, THEN <required rule>, BECAUSE <reason>.`

Example invariants:

- `INV-1: IF a request includes session id S, THEN S maps to at most one active session record, BECAUSE ambiguity breaks continuity correctness.`
- `INV-2: IF expiresAt <= now, THEN the session is invalid for continuity behavior, BECAUSE expired continuity must not be trusted.`
- `INV-3: IF logout succeeds, THEN future requests with that prior session id fail continuity checks, BECAUSE logout must terminate session authority.`

Enforcement map:

- Middleware resolves and validates per-request continuity.
- Service enforces lifecycle transitions.
- Repository enforces storage-level contract behavior.

## 15. Security Fundamentals in Session Scope

Session systems carry security responsibilities even before full auth policy details.

Session fixation is a risk when an attacker can cause a victim to use a known session ID. Regeneration on sensitive transitions is a standard mitigation pattern.

Session hijacking is a risk when valid session tokens leak. Transport security, cookie attributes, TTL policy, and invalidation behavior all matter.

Cookie-based sessions are related to CSRF risk on state-changing actions. This chapter introduces that relationship; deeper policy work follows with authentication/authorization material.

Do not place raw credentials inside session state. Keep session records minimal and purpose-specific.

## 16. Failure Modes and Operational Realities

Real systems fail in practical ways, not only in theory.

Common session failure patterns:

- Restart wipes memory-mode sessions.
- Expiration logic behaves unexpectedly due to time assumptions.
- Parallel requests race to update shared session fields.
- Multi-tab behavior surprises users when one tab logs out or changes context.

The operational response is familiar from previous lectures: define invariants, test transitions, and log lifecycle events for debugging.

## 17. Testing Strategy for Session Behavior

Sessions should be tested as behavioral contracts.

Unit tests are useful for helpers such as ID validation and expiration logic.

Integration tests (Express + Supertest) should verify:

- session establishment returns continuity cookie,
- follow-up request with same cookie resolves continuity,
- logout destroys continuity.

Use the same contract tests for both in-memory and Prisma session repositories. This keeps behavior storage-agnostic, consistent with Homework 02 expectations.

Restart-style verification is also important:

- in-memory continuity should fail after restart,
- Prisma-backed continuity should survive restart until expiry or invalidation.

Mini scenario: run the same Supertest sequence in both modes. In memory mode, a restart between requests should break continuity. In Prisma mode, the second request should still resolve session context if the record has not expired.

## 18. Session vs Token-Based Approaches (Conceptual Contrast)

This course teaches session-based continuity first because it aligns naturally with server-rendered Express flow and the architecture boundary style you already use.

Token-heavy stateless API designs are valid in other contexts, but they introduce different tradeoffs around revocation, payload management, and trust boundaries. At this stage, conceptual contrast is enough.

## 19. Integration with Rendering and Persistence Threads

Sessions connect directly to earlier course threads.

Rendering logic should consume continuity context, not own session persistence details. Repository boundaries should isolate session storage implementation. Controllers should continue mapping explicit `Result` outcomes.

In server-rendered and HTMX flows, session continuity influences which actions are valid, what partial responses are returned, and how errors are surfaced.

## 20. Common Misconceptions

A frequent misconception is that HTTP itself remembers users. It does not.

Another common misconception is that cookie presence always means authentication. It does not.

Another is that local storage can replace session design. It usually cannot for server-side continuity guarantees.

Another is that in-memory session storage is production-safe by default. It usually is not.

Finally, session establishment is not authorization. They are related but different responsibilities.

## 21. Study Guide and Practice Prompts

To study this chapter well, focus on three layers: protocol model, continuity lifecycle, and implementation boundaries.

Short-answer prompts:

1. Why is session ID not the same as user ID?
2. Why is cookie presence alone insufficient for trusted continuity?
3. What specific behavior fails when sessions are memory-only?

Design prompts:

1. Propose a session expiration policy for a journaling app on shared devices.
2. Define three invariants for logout correctness.

Debugging prompts:

1. A user reports random logout after a deploy restart. What storage assumption failed?
2. Two concurrent requests overwrite session metadata unexpectedly. What invariant is at risk?

## 22. Bridge to Next Lecture: Authentication and Authorization

This chapter gives you continuity mechanics. Next lecture adds identity-proof and policy enforcement layers.

Authentication answers: did the subject prove identity?

Authorization answers: is this subject allowed to do this action now?

Those checks depend on correct session establishment and lifecycle behavior.

## 23. Further Reading and References

For detailed term definitions, use [Appendix A Glossary](./a-glossary.md).

For API and code-call explanations, use [Appendix B Code Reference](./b-code-reference.md).

External references:

- MDN HTTP overview: https://developer.mozilla.org/en-US/docs/Web/HTTP
- MDN Cookies guide: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
- MDN `Set-Cookie` header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
- Express docs: https://expressjs.com/
- `express-session` docs: https://github.com/expressjs/session
- Prisma ORM docs: https://www.prisma.io/docs/orm
- Prisma schema reference: https://www.prisma.io/docs/orm/reference/prisma-schema-reference
- Prisma Migrate docs: https://www.prisma.io/docs/orm/prisma-migrate
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP CSRF Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Supertest: https://github.com/ladjs/supertest
- Jest docs: https://jestjs.io/docs/getting-started
