1. Title: Identity, Credentials, and Session Establishment
2. Community Agreement
3. Schedule
4. Connection to Last Lecture (ORM boundary recap)
	1. Last lecture: persistence boundary and repository contract
	2. Today
		1. Identity, Credentials, and Session Establishment
		2. Sessions live at the HTTP/application boundary
	3. Next lecture: authentication and authorization use session state
5. Why Sessions Exist
	1. Users expect continuity across requests
	2. Multi-step workflows need server-side continuity
	3. Personalization and user-specific state require identity continuity
6. What HTTP Does Not Give Us
	1. HTTP is stateless by default
	2. Each request is independent unless app adds state linkage
	3. Server memory alone is not sufficient for user continuity
7. Stateless vs Session-Based Request Flow (diagram slide)
	1. Show side-by-side request flow
	2. Stateless: no durable request-to-request link
	3. Session-based: stable session identifier links requests
	4. Introduce browser mechanisms students can use:
		1. Cookies (small values sent automatically with matching requests)
		2. Local storage (browser-kept key/value state)
	5. Clarify: these mechanisms exist, but design choices change risk and correctness
8. Discussion Point (5 minutes)
	1. Prompt: “We can keep continuity data in the browser, on the server, or split between both. How do we create a continuous browser-server channel so each new request can tell one browser apart from another?”
	2. Frame the problem without giving the answer:
		1. Browser can store data (for example localStorage, cookies)
		2. Server can store per-user session state
		3. HTTP requests are still independent unless we intentionally link them
	3. Discussion question: “What should the browser send each request, what should the server store, and what are the tradeoffs of that split?”
	4. Students discuss in small groups (5 min)
	5. Whole-class synthesis: continuity channel design, correctness, and risk
9. Identity, Credentials, and Session (Vocabulary)
	1. Identity: who the system believes this is
	2. Credentials: proof presented by client
	3. Session: server-established continuity after verification
	4. Today focuses on session establishment and use, not full auth policy
10. Core Session Lifecycle
	1. Establish session
	2. Attach session id to client
	3. Read/update session data per request
	4. Expire/invalidate session
11. Session ID and Cookie Basics
	1. Session ID is an opaque token, not user data
	2. Cookie carries the session id between requests
	3. Cookie attributes matter (`HttpOnly`, `Secure`, `SameSite`)
12. Express Session Conceptual Setup
	1. Middleware-based session support in Express
	2. `req.session` as per-request session state handle
	3. Why middleware order matters
13. Express Session Minimal Example (code walkthrough)
	1. Initialize session middleware
	2. Add a route that writes a session value
	3. Add a route that reads and renders session value
14. Session Store Choices
	1. Memory store for learning/dev only
	2. Persistent/shared store for real deployments
	3. Why restart behavior and multi-instance behavior matter
15. Session Correctness and Security Fundamentals
	1. Regenerate session on sensitive transitions
	2. Avoid storing sensitive raw credentials in session
	3. Use expiration and explicit logout/invalidation
16. In-Class Activity (longer, 15-20 minutes)
	1. Pairs: implement a tiny session flow in Express
	2. Task A: set a session value on one route
	3. Task B: read/display it on another route
	4. Task C: add logout route that destroys session
	5. Verification: demonstrate continuity across two requests and loss after logout
17. Activity Debrief
	1. What worked, what failed, and why
	2. Common pitfalls (middleware order, missing cookie attributes, store assumptions)
	3. Map outcomes back to HTTP statelessness and session lifecycle
18. How This Prepares Next Lecture
	1. Today: session establishment and continuity mechanics
	2. Next: authentication (proving identity) and authorization (access control)
	3. Bridge: auth decisions rely on correct session handling
19. Wrap-Up Summary
	1. HTTP does not provide user continuity by itself
	2. Sessions establish continuity in Express
	3. Session lifecycle + store choice affect correctness
20. Conclusion and Next Steps
	1. Review today’s session flow example
	2. Read ahead for authentication/authorization lecture
	3. Bring one question about session risks to next class

## Timing Notes (75 minutes with buffer)

- Slides 1-3: 6 minutes
- Slides 4-7: 12 minutes
- Slide 8 discussion: 9 minutes (5 discussion + 4 debrief)
- Slides 9-15: 24 minutes
- Slide 16 activity: 18 minutes
- Slide 17 debrief: 4 minutes
- Slides 18-20 wrap-up: 2 minutes

Total planned: 75 minutes
