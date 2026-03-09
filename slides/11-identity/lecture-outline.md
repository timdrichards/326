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
	6. Before Activity 1, make the slide content explicit enough that students can state:
		1. the browser sends the cookie back on later requests
		2. the cookie should hold an opaque session id, not the full user state
		3. the server uses that session id to look up session data it stores
		4. continuity fails if browser and server are not storing matching pieces of the design
8. In-Class Activity 1: Continuity Channel Puzzle (8 minutes)
	1. Paper-and-pencil, pairs
	2. Put one shared browser-server request sequence on a single slide with a few blanks and one intentionally wrong design choice
	3. Task: every student pair copies the same sequence onto paper and fills in what the browser stores, what the browser sends, and what the server stores so the second and third requests can be linked to the same user
	4. Require students to identify the one broken step in the shared sequence and explain why it breaks continuity
	5. Deliverable: annotate the common request flow and circle the exact step where the design fails
	6. Activity slide must include enough visible context to solve it without recall alone:
		1. browser, request, response, cookie, session id, and server session store labels
		2. one concrete example session id value
		3. a reminder that HTTP is stateless unless the app creates a continuity channel
9. Discussion Point (5 minutes)
	1. Prompt: “We can keep continuity data in the browser, on the server, or split between both. How do we create a continuous browser-server channel so each new request can tell one browser apart from another?”
	2. Frame the problem without giving the answer:
		1. Browser can store data (for example localStorage, cookies)
		2. Server can store per-user session state
		3. HTTP requests are still independent unless we intentionally link them
	3. Discussion question: “What should the browser send each request, what should the server store, and what are the tradeoffs of that split?”
	4. Students discuss in small groups (5 min)
	5. Whole-class synthesis: continuity channel design, correctness, and risk
10. Identity, Credentials, and Session (Vocabulary)
	1. Identity: who the system believes this is
	2. Credentials: proof presented by client
	3. Session: server-established continuity after verification
	4. Today focuses on session establishment and use, not full auth policy
11. Core Session Lifecycle
	1. Establish session
	2. Attach session id to client
	3. Read/update session data per request
	4. Expire/invalidate session
12. Session ID and Cookie Basics
	1. Session ID is an opaque token, not user data
	2. Cookie carries the session id between requests
	3. Cookie attributes matter (`HttpOnly`, `Secure`, `SameSite`)
13. Express Session Conceptual Setup
	1. Middleware-based session support in Express
	2. `req.session` as per-request session state handle
	3. Why middleware order matters
14. Express Session Minimal Example (code walkthrough)
	1. Initialize session middleware
	2. Add a route that writes a session value
	3. Add a route that reads and renders session value
15. Session Store Choices
	1. Memory store for learning/dev only
	2. Persistent/shared store for real deployments
	3. Why restart behavior and multi-instance behavior matter
16. Session Correctness and Security Fundamentals
	1. Regenerate session on sensitive transitions
	2. Avoid storing sensitive raw credentials in session
	3. Use expiration and explicit logout/invalidation
	4. Before Activity 2, explicitly summarize the failure-to-cause links students will need:
		1. restart failure points to volatile in-memory storage
		2. different server behavior points to non-shared session storage across instances
		3. sensitive data in session is a bad data-minimization/security choice
17. In-Class Activity 2: Session Failure Detective (10 minutes)
	1. Paper-and-pencil, small groups
	2. Put one shared broken system description on a single slide:
		1. user logs in successfully
		2. server restarts and the session disappears
		3. second server instance does not recognize the same session
		4. session object contains sensitive raw credential data
	3. Task: every group identifies the design flaw behind each failure and writes a one-sentence fix for each one
	4. Ask groups to rank the listed failures from most dangerous to least dangerous and justify the top choice
	5. Debrief target: connect the common scenario back to store choice, lifecycle, and security decisions
	6. Activity slide must include a compact “facts you may use” box:
		1. memory store is for dev only and is lost on restart
		2. multi-instance apps need a shared session store
		3. sessions should store minimal necessary state, not raw credentials
18. Activity Debrief
	1. What worked, what failed, and why
	2. Common pitfalls (middleware order, missing cookie attributes, store assumptions)
	3. Map outcomes back to HTTP statelessness and session lifecycle
19. How This Prepares Next Lecture
	1. Today: session establishment and continuity mechanics
	2. Next: authentication (proving identity) and authorization (access control)
	3. Bridge: auth decisions rely on correct session handling
20. Wrap-Up Summary
	1. HTTP does not provide user continuity by itself
	2. Sessions establish continuity in Express
	3. Session lifecycle + store choice affect correctness
21. Conclusion and Next Steps
	1. Review today’s session flow example
	2. Read ahead for authentication/authorization lecture
	3. Bring one question about session risks to next class

## Timing Notes (75 minutes with buffer)

- Slides 1-3: 6 minutes
- Slides 4-7: 12 minutes
- Slide 8 activity: 8 minutes
- Slide 9 discussion: 7 minutes (5 discussion + 2 synthesis)
- Slides 10-16: 25 minutes
- Slide 17 activity: 10 minutes
- Slide 18 debrief: 4 minutes
- Slides 19-21 wrap-up: 3 minutes

Total planned: 75 minutes
