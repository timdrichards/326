---
theme: default
background: https://cover.sli.dev
class: text-center
transition: fade
backgroundTransition: fade
drawings:
  persist: false
mdc: true
duration: 75min
lineNumbers: true
highlighter: shiki
controls: true
progress: true
slideNumber: true
center: false
overview: true
hash: true
routerMode: hash
navigationMode: default
width: 1280
height: 720
margin: 0.08
timeForPresentation: "75"
title: "Identity, Credentials, and Session Establishment"
favicon: /favicon.svg
info: |
  COMPSCI 326 Web Programming
  Lecture 6.11: Identity, Credentials, and Session Establishment
---

<style>
@import "./styles/main.css";
@import "./styles/styles.css";
</style>

# Identity, Credentials, and Session Establishment

## COMPSCI 326 Web Programming

<div class="text-2xl opacity-70 mt-6">
Lecture 6.11: Identity and Sessions
</div>

---
layout: two-cols-header
class: text-2xl community-agreement
---

## Community Agreement

::left::

- **Attend & Engage:** Show up every class and be fully present - learning improves when we participate together.
- **Stay Focused:** No devices in class (unless asked); laptops and phones pull attention away from you and others.
- **Use AI Responsibly:** AI tools are allowed when used transparently and to support, not replace, your own thinking.

::right::

- **Learn with a Growth Mindset:** Mistakes and questions are part of the process, ask early and often.
- **Respect & Include Everyone:** Value diverse experiences, assume positive intent, and maintain a safe space for questions.
- **Support Each Other:** Collaborate to help peers understand, not just finish work; listen generously.

---
class: text-2xl
---

## Agenda

- Connect to persistence and ORM boundaries
- Explain why HTTP alone does not give user continuity
- Build the session mental model from browser to server
- Practice with two paper-and-pencil activities
- Bridge to authentication and authorization

**Outcome:** you can explain how a browser and server maintain continuity across requests.

---
layout: two-cols
class: text-2xl cols-60-40
---

## Connection to Last Lecture

- Last time, persistence lived behind a repository boundary.
- The database became the durable source of truth.
- Today, we move up one layer to the HTTP/application boundary.

<div class="callout">
Sessions are not a database replacement. They are a continuity mechanism between browser requests.
</div>

::right::

<img src="./images/6.10-orm-boundary.svg" alt="ORM boundary diagram from last lecture" class="rounded shadow-lg mt-6" />

---
class: text-2xl
---

## Why Sessions Exist

- Users expect continuity across requests.
- Multi-step workflows need state that survives more than one route.
- Personalization depends on remembering something about this browser.
- A successful login would be useless if the next request forgot it immediately.

---
layout: two-cols
class: text-2xl cols-60-40
---

## What HTTP Does Not Give Us

- HTTP is stateless by default.
- Each request arrives as a separate event.
- Server process memory alone is not enough for browser-specific continuity.

<div class="callout callout-warn">
If two requests look identical, HTTP itself does not tell the server whether they came from the same browser.
</div>

::right::

```text
Request 1  --->  server handles it  ---> done
Request 2  --->  server handles it  ---> done

No built-in memory link
between request 1 and request 2
```

---
layout: two-cols
class: text-xl cols-67-33
---

## Stateless vs Session-Based Request Flow

```mermaid
flowchart TD
  subgraph A[Stateless]
    A1["Browser -> GET /dashboard"] --> A2["Server handles request"]
    A2 --> A3["No durable per-browser link"]
  end

  subgraph B[Session-Based]
    B1["Login request with credentials"] --> B2["Server verifies credentials"]
    B2 --> B3["Server creates session record"]
    B3 --> B4["Response sets cookie: sid=sess_7F3A"]
    B4 --> B5["Later request sends cookie back"]
    B5 --> B6["Server reads sid and loads session data"]
  end
```

<div class="callout">
The browser stores a small token. The server stores the session data. The token links them.
</div>

::right::

<ul class="ul-frame">
  <li>Browser can store a cookie.</li>
  <li>Cookie should carry an opaque session id.</li>
  <li>Server uses that id to look up session state.</li>
  <li>Continuity fails when those pieces do not match.</li>
</ul>

---
layout: two-cols-header
class: text-xl exercise-compact cols-67-33
---

## In-Class Activity 1: Continuity Channel Puzzle

::left::

Everyone solves the same problem on paper with a partner.

```text
Shared sequence

1. Browser -> POST /login with credentials
2. Server verifies credentials
3. Server creates session record:
   key = "sess_7F3A"
   value = { userId: 42, role: "student" }
4. Server response sends:
   Set-Cookie: sid = __________
5. Browser stores that cookie
6. Later browser request sends:
   Cookie: userId = 42          <-- one step is wrong
7. Server tries to look up:
   sessionStore[ __________ ]
8. If lookup succeeds, server knows this is the same browser
```

Write down:
- the correct cookie value in step 4
- the correct lookup key in step 7
- the exact step number that is broken
- one sentence explaining why it breaks continuity

::right::

<div class="sticky-note">
Facts you may use
</div>

<ul class="ul-frame">
  <li>HTTP is stateless unless the app creates a continuity channel.</li>
  <li>The browser sends the cookie back on later requests.</li>
  <li>The cookie should hold the session id, not the full user state.</li>
  <li>The server looks up session data by that session id.</li>
</ul>

---
class: text-2xl
---

## Discussion Point

“We can keep continuity data in the browser, on the server, or split between both. How do we create a continuous browser-server channel so each new request can tell one browser apart from another?”

Discuss in small groups:

- What should the browser send each request?
- What should the server store?
- What tradeoffs come from that split?

---
layout: two-cols
class: text-2xl cols-60-40
---

## Identity, Credentials, and Session

- **Identity:** who the system believes this is
- **Credentials:** proof presented by the client
- **Session:** server-established continuity after verification

<div class="callout">
Today is about session establishment and use, not full authentication policy.
</div>

::right::

```text
credentials  ->  verification  ->  session

"Prove it"      "Check it"        "Remember it"
```

---
class: text-xl
---

## Core Session Lifecycle

```mermaid
flowchart LR
  A["1. Establish session"] --> B["2. Attach session id to client"]
  B --> C["3. Read or update session per request"]
  C --> D["4. Expire or invalidate session"]
```

- Establish after a successful identity check
- Attach the session id to the client, usually with a cookie
- Reuse and update session data on later requests
- End the session explicitly or by expiration

---
layout: two-cols
class: text-xl cols-60-40
---

## Session ID and Cookie Basics

```http
HTTP/1.1 200 OK
Set-Cookie: sid=sess_7F3A; HttpOnly; Secure; SameSite=Lax
Content-Type: text/html
```

```http
GET /dashboard HTTP/1.1
Cookie: sid=sess_7F3A
```

::right::

<ul class="ul-frame">
  <li><code>sid</code> is an opaque token, not user data.</li>
  <li><code>HttpOnly</code> helps block JavaScript access.</li>
  <li><code>Secure</code> means send only over HTTPS.</li>
  <li><code>SameSite</code> helps reduce cross-site request risk.</li>
</ul>

---
layout: two-cols
class: text-xl cols-60-40
---

## Express Session Conceptual Setup

```ts
import express from "express";
import session from "express-session";

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  },
}));
```

::right::

<template v-if="$clicks === 0">
  <ul class="ul-frame">
    <li>Session support is middleware in Express.</li>
    <li>Middleware must run before routes that use <code>req.session</code>.</li>
    <li>The middleware manages cookie parsing and session lookup.</li>
  </ul>
</template>

<template v-else-if="$clicks === 1">
  <div class="callout">
    <code>secret</code> signs the session cookie so the client cannot freely forge it.
  </div>
</template>

<template v-else-if="$clicks === 2">
  <div class="callout callout-warn">
    <code>secure: false</code> is only for local development over plain HTTP.
  </div>
</template>

<template v-else>
  <div class="callout">
    After this middleware runs, route handlers can read and write session state through <code>req.session</code>.
  </div>
</template>

<v-click />
<v-click />
<v-click />

---
class: text-xl
---

## Express Session Minimal Example

```ts {1-7|9-13|15-19|all}
app.get("/login-demo", (req, res) => {
  req.session.user = {
    id: 42,
    role: "student",
  };
  res.send("session established");
});

app.get("/dashboard", (req, res) => {
  const role = req.session.user?.role ?? "guest";
  res.send(`current role: ${role}`);
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("logged out");
  });
});
```

<div class="text-2xl leading-relaxed" v-if="$clicks === 0">
  <p><strong>Block 1:</strong> one route creates session state after a successful event.</p>
</div>

<div class="text-2xl leading-relaxed" v-else-if="$clicks === 1">
  <p><strong>Block 2:</strong> a later route reads session state and changes behavior.</p>
</div>

<div class="text-2xl leading-relaxed" v-else-if="$clicks === 2">
  <p><strong>Block 3:</strong> logout invalidates the session instead of leaving it alive forever.</p>
</div>

<div class="text-2xl leading-relaxed" v-else>
  <p><strong>Key idea:</strong> session state sits at the HTTP/application layer and affects later requests.</p>
</div>

---
layout: two-cols
class: text-2xl cols-60-40
---

## Session Store Choices

- Memory store is acceptable for learning and quick local demos.
- Real deployments need a store that survives restart and can be shared.
- Multi-instance deployments break if each server keeps isolated session memory.

<div class="callout callout-warn">
If the store disappears on restart, the session disappears too.
</div>

::right::

```text
One server + memory store
  restart => sessions lost

Two servers + separate memory stores
  request may hit server A or server B
  same cookie, different session memory
```

---
layout: two-cols
class: text-2xl cols-60-40
---

## Session Correctness and Security Fundamentals

- Regenerate sessions on sensitive transitions such as login.
- Do not store raw credentials in the session.
- Use expiration and explicit logout.

<div class="callout">
Before the next activity, keep three cause-and-effect rules in mind.
</div>

::right::

<ul class="ul-frame">
  <li>Restart failure usually means volatile in-memory storage.</li>
  <li>Different server behavior usually means no shared session store.</li>
  <li>Sensitive data in session is a bad minimization and security choice.</li>
</ul>

---
layout: two-cols-header
class: text-xl exercise-compact cols-67-33
---

## In-Class Activity 2: Session Failure Detective

::left::

Everyone solves the same scenario on paper in small groups.

```text
Broken system description

- A user logs in successfully.
- After the server restarts, the user is logged out.
- On a two-server deployment, server A recognizes the session
  but server B does not.
- The session object stores the user's raw password.
```

Write down:

1. the design flaw behind each failure
2. a one-sentence fix for each flaw
3. which flaw is the most dangerous, and why

::right::

<div class="sticky-note">
Facts you may use
</div>

<ul class="ul-frame">
  <li>Memory store is for dev only and is lost on restart.</li>
  <li>Multi-instance apps need a shared session store.</li>
  <li>Sessions should store minimal necessary state, not raw credentials.</li>
</ul>

---
class: text-2xl
---

## Activity Debrief

- What clues pointed to each failure cause?
- Which fixes improved correctness?
- Which fixes improved security?
- How did store choice and lifecycle rules explain the whole scenario?

<div class="callout">
The point is not memorizing one library. The point is recognizing the design pattern and its failure modes.
</div>

---
layout: two-cols
class: text-2xl cols-60-40
---

## How This Prepares Next Lecture

- Today: establish continuity after verification.
- Next lecture: prove identity and enforce access control.
- Authentication and authorization depend on correct session handling.

<div class="callout">
If session state is wrong, later authorization decisions are wrong too.
</div>

::right::

```text
credentials -> verify -> establish session
session -> use on later requests
later lecture -> decide what this user may do
```

---
class: text-2xl
---

## Wrap-Up Summary

- HTTP does not provide user continuity by itself.
- Sessions create continuity by linking a browser-held token to server-held state.
- Session lifecycle, store choice, and cookie settings affect correctness and risk.
- Express exposes this through middleware and <code>req.session</code>.

---
class: text-2xl
---

## Conclusion and Next Steps

- Review today’s request flow and two activity solutions.
- Be ready to distinguish identity, credentials, and session.
- Bring one question about session risks to the next class.

<CourseCallout title="Main Takeaway">
Sessions are an application-layer design for continuity across stateless HTTP requests.
</CourseCallout>
