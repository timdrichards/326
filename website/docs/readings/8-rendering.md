---
title: '08 Rendering'
sidebar_position: 1
---

# 08 Rendering

## HTML, HTMX, and the DOM

This is the primary reading for Lecture 5.8, and it is written for students taking COMPSCI 326 Web Programming. The goal is not just to introduce a few HTMX attributes, but to give you a durable mental model for how dynamic web interfaces work when the server is still in charge of rendering. By the end of this chapter, you should be able to read and write HTMX-based HTML, build the matching Express routes, reason about the DOM updates HTMX performs, and explain the whole process clearly enough to succeed on an exam.

The central theme of this lecture is that rendering is a representation boundary. Human beings write HTML. Browsers parse that HTML into a DOM tree. Servers can generate HTML either as full pages or as small fragments. HTMX sits in the middle of this process and gives you precise control over which part of the browser’s DOM should be updated when the server returns new HTML. That is the entire game.

If you remember one sentence from this writing, remember this: HTMX lets you build dynamic interfaces by sending normal HTTP requests and swapping server-rendered HTML into the DOM.

## 1. Starting from the Web UI You Already Know

Before HTMX makes sense, it helps to start with the ordinary web. A web page is not a magical application shell. At its core, it is a document the browser loads, parses, and renders. The standard ingredients are HTML for structure, CSS for presentation, and JavaScript for behavior. In this lecture, HTMX gives us behavior, but it does so through HTML attributes rather than a large client framework.

That design choice matters for beginners. You do not have to learn a new component language, a client-side state model, and a build system just to make a search box update a list or a form show validation errors. Instead, you build on web primitives you already need to know anyway: routes, forms, HTTP methods, and templates.

This is why the lecture emphasizes HTMX as a minimal-overhead path to partial re-rendering. It is not trying to replace everything else you might learn later. It is showing you a simpler and very effective way to build many kinds of interactive applications.

## 2. HTML as Structure and Meaning

HTML (HyperText Markup Language) is the language used to describe the structure of a web page. It is made of elements such as headings, paragraphs, inputs, forms, buttons, and containers. Most HTML elements have an opening tag and a closing tag around some content:

```html
<h1>Welcome</h1>
<p>This is a page.</p>
```

Some elements, such as `input`, do not wrap content and are written as self-contained tags:

```html
<input name="username" />
```

What makes HTML powerful is not just that it can display text. HTML gives semantics to the interface. A `form` means “these fields are submitted together.” A `button` means “this is something the user can trigger.” An `input` with a `name` means “this value should be submitted as part of the request.” Those semantics become especially important in HTMX applications because HTMX is built on top of normal browser behavior rather than replacing it.

Attributes are the knobs that configure an element. In normal HTML, you might write `action` and `method` on a form, or `type` and `name` on an input. With HTMX, you add attributes like `hx-post`, `hx-target`, and `hx-swap` to describe dynamic behavior directly in HTML. In that sense, HTMX feels natural because it extends a language you are already using instead of asking you to leave it.

As you work with HTMX, one HTML skill becomes especially important: thinking in valid, well-structured fragments. HTMX often swaps only part of a page, so the HTML you return from the server must make sense at the place where it is inserted. If your fragment structure is wrong for that location, the browser may repair it in unexpected ways or produce awkward nested output. That is one reason this lecture pairs HTMX with a DOM discussion instead of treating it as just a list of attributes.

## 3. The DOM: The Browser’s Internal Representation

When a browser receives HTML, it does not render the raw text directly. It parses the HTML into an in-memory tree structure called the Document Object Model (DOM). Each HTML element becomes a DOM element node, and text becomes text nodes inside that tree. The browser renders the page from this representation.

This distinction between HTML and the DOM is essential for understanding HTMX. HTML is what the server sends and what you write. The DOM is what the browser updates. HTMX does not “re-render your app” in the way a front-end framework talks about rendering. HTMX asks the server for HTML and then performs a DOM swap at a target element.

Consider this HTML:

```html
<div id="panel">
  <p>Hello</p>
  <button>OK</button>
</div>
```

You can think of the browser’s DOM tree as a `div` node with two children: a `p` and a `button`. If HTMX later updates `#panel`, it is changing that portion of the DOM tree. This is why the lecture spends time on the phrase “rendering as a representation boundary”: the browser renders a DOM representation, and HTMX gives you control over replacing pieces of that representation with server-generated HTML.

Two DOM concepts appear constantly in HTMX work: `innerHTML` and `outerHTML`. If you replace `innerHTML`, you keep the target element itself but replace its contents. If you replace `outerHTML`, you replace the target element itself. This is a small difference in wording but a huge difference in behavior, and it is one of the most common exam and debugging topics in HTMX applications.

## 4. From Full Page Reloads to Partial Re-Rendering

In classic server-rendered applications, the browser requests a page, the server returns a full HTML document, and the browser renders it. When the user clicks a link or submits a form, the process happens again: new request, full page response, full page render. This is a perfectly valid and often useful model, but it can feel slow or awkward for interactions that only affect one small region of the interface.

The lecture frames this as a contrast between two approaches. In the full re-render approach, each interaction results in the entire view being generated again and the browser replacing the whole page. In the partial re-render approach, the page is still initially loaded as a full page, but later interactions update only the part of the page that changed.

That shift in thinking is the core HTMX mindset. Instead of treating the page as one indivisible thing, you start seeing it as a composition of independently updatable regions. A search results area can update without changing the rest of the page. A cart total can update without reloading the header and footer. A form panel can swap between an error version and a success version without the entire page refreshing.

This is what makes HTMX feel modern while still being deeply rooted in classic web architecture: you are not abandoning server rendering, you are making it more precise.

## 5. The HTMX Worldview and the Cognitive Rail

The lecture describes HTMX as a kind of discipline. That is an excellent description. HTMX encourages you to stay on a simple rail instead of drifting into unnecessary client-side complexity. The rail looks like this:

A trigger happens. An HTTP request happens. The server returns HTML. A DOM swap happens.

That is the whole loop.

This loop is useful because it gives you a consistent way to reason about every interaction. A button click, a form submission, and a live search input can all be explained using the same sequence. Even when the UI feels “reactive,” the underlying mechanics are the same. Once you internalize that, HTMX stops feeling mysterious.

This worldview also creates a strong contrast with a SPA-style approach. In many SPA architectures, the browser requests JSON, updates client-side state, and then re-renders components in JavaScript. HTMX usually skips that layer. The server returns HTML directly, and the browser swaps it into the DOM. The technical change is simple, but the cognitive change is bigger: you stop assuming that browser-side state machinery is necessary for every interactive UI.

## 6. The Core HTMX Attributes: Your Control Surface

HTMX works by reading special attributes from HTML elements. In this chapter, you should focus on five of them first: `hx-get`, `hx-post`, `hx-trigger`, `hx-target`, and `hx-swap`. These are the main controls used throughout the lecture examples.

The request attributes (`hx-get`, `hx-post`, and also `hx-put`/`hx-delete` when needed) tell HTMX what HTTP request to send. The trigger attribute (`hx-trigger`) tells HTMX when to send that request. The target attribute (`hx-target`) tells HTMX where the response should land in the current DOM. The swap attribute (`hx-swap`) tells HTMX how the returned HTML should be inserted or replaced.

Once you know those four decisions for an interaction, you can usually implement it.

A small example shows the pattern clearly:

```html
<button
  hx-get="/tip"
  hx-target="#panel"
  hx-swap="innerHTML">
  Load tip
</button>
<div id="panel"></div>
```

In plain English, this says: when the button is triggered, send a `GET /tip` request, and when the server returns HTML, replace the inside of `#panel` with that HTML. That sentence is already enough to explain the interaction on an exam.

## 7. Trigger, Request, Fragment, Swap: The Four-Part Analysis

The lecture repeatedly returns to a four-part analysis of HTMX interactions, and it is worth adopting as your default language. For any interaction, identify the trigger, the request, the fragment, and the swap.

The trigger is the user or browser event that starts the process. This might be a click, a form submission, a key press, an element load, or a timer. The request is the HTTP method and path, such as `GET /search` or `POST /badge`. The fragment is the HTML returned by the server for that interaction. The swap is the combination of a target region and a swap type, such as “replace `#results` using `innerHTML`.”

This structure is not just good for learning; it is also good for debugging. When an HTMX feature fails, you can step through those four parts in order instead of guessing.

## 8. The Server Side: Express, EJS, and HTMX Working Together

The lecture examples use Express and EJS, which is a very beginner-friendly combination for HTMX. Express handles routes and requests. EJS renders templates. HTMX lives in the browser and asks the server for HTML. Because the server already knows how to render HTML, you can reuse the same templating skills for both full pages and fragments.

In all four examples, the server follows the same general shape. There is a `GET /` route that renders the initial full page. Then there are one or more HTMX endpoints that return partial templates. The browser loads the full page once, and HTMX endpoints handle later interactions.

You will also see `express.urlencoded({ extended: true })` in these examples. This middleware is necessary for parsing standard HTML form submissions so that fields appear in `req.body`. Beginners often forget this and then wonder why form data seems to be missing. HTMX does not remove that requirement because HTMX is still using normal HTTP form submission semantics.

The result is a powerful but simple architecture: one server, one templating system, full pages for initial loads, and fragments for incremental updates.

## 9. Example One: The Counter and the Shape of a Partial Update

The counter example is the smallest complete HTMX interaction in the lecture, and that is exactly why it is so useful. The page contains a region with `id="counter"` and three buttons that post to increment, decrement, or reset the count. Each button points HTMX at the same target and asks for an `innerHTML` swap.

The server keeps a small in-memory counter variable. When you click `+1`, HTMX sends `POST /counter/increment`. The Express route updates the count and renders the `partials/counter.ejs` fragment. HTMX then swaps that fragment into the `#counter` region. Nothing else on the page changes, and the browser does not reload the page.

This example is important because it strips away distractions. There is no JSON API, no client state management, and no front-end framework. The only moving parts are the trigger, the request, the partial template, and the swap. If you fully understand the counter, you understand the foundation of the lecture.

It is also the best place to see the distinction between full page rendering and fragment rendering. The initial `GET /` returns a whole HTML document. The later counter routes return only the small counter fragment. If you look in the browser DevTools Network tab, that difference is immediately visible in the response bodies, and seeing it once makes the HTMX model feel much more concrete.

## 10. Example Two: The Name Badge and HTMX-Enhanced Forms

The name badge example introduces the form pattern, which is one of HTMX’s most practical strengths. The form is intentionally written as a normal HTML form with `action="/badge"` and `method="post"`, then enhanced with `hx-post="/badge"` and `hx-target="#result"`.

That design is pedagogically excellent. It reinforces that HTMX is not replacing forms; it is enhancing them. The browser still understands the form semantically. The server still handles a `POST /badge`. The only difference is that HTMX intercepts the submission and swaps the response into a target region instead of allowing a full page reload.

The server route demonstrates another important concept: checking whether the request came from HTMX by reading the `HX-Request` header. If the header is present and equal to `true`, the server can return only the badge fragment. If the request is not an HTMX request, the same route can render a full page as a fallback. This is a clean example of progressive enhancement and a useful pattern to discuss on an exam.

The broader lesson is that good HTMX code often starts as good HTML. When the form is written with correct `action`, `method`, `name`, and `button` semantics, HTMX becomes a thin layer of interaction behavior rather than a replacement for web fundamentals.

## 11. Example Three: Server-Side Validation Without a Client Framework

The validation example addresses a common beginner misconception: the idea that good user experience requires moving validation logic into browser-side JavaScript or a client framework. HTMX shows another path. You can keep validation on the server and still provide smooth, partial updates.

In this example, the page includes a panel region. The form submits to `/validate` using `hx-post` and targets `#panel`. The server parses the submitted username and checks whether it meets a minimum length. If validation fails, the server re-renders the form partial with the user’s previous input and an inline error message. If validation succeeds, the server renders a success fragment instead. HTMX swaps whichever fragment the server returns into the same panel region.

This pattern is worth studying carefully because it scales to many real applications. The server remains the source of truth for validation rules. The browser gets a fast, focused update. The code stays simple because there is no JSON translation layer and no manual DOM manipulation logic in client-side JavaScript.

From an exam perspective, this example is ideal for explaining why HTMX can produce “good UX” without a SPA framework. The answer is that the interaction still feels immediate, but the rendering and validation are kept in the same place on the server.

## 12. Example Four: Live Search and Event-Driven Requests

The live search example expands the model beyond clicks and submits by introducing `hx-trigger`. The input field uses `hx-get="/search"`, `hx-target="#results"`, and `hx-trigger="keyup changed delay:300ms"`. This is one of the lecture’s key examples because it demonstrates how HTMX can produce a reactive feel while staying on the same mental rail.

When the user types, HTMX listens for `keyup` events. The `changed` modifier helps avoid unnecessary requests when the value has not actually changed, and `delay:300ms` introduces a small pause so the server is not hit on every keystroke immediately. After the delay, HTMX sends a `GET /search?q=...` request, the server filters the data and renders a results fragment, and HTMX swaps that fragment into `#results`.

What is striking about this example is how little the core model changes compared to the counter. The trigger is different, and the request method is `GET` instead of `POST`, but the interaction is still trigger, request, fragment, swap. That consistency is one of HTMX’s biggest advantages for beginners.

## 13. Understanding `hx-target` and `hx-swap` as Design Decisions

Students often treat `hx-target` and `hx-swap` as syntax details, but they are really design decisions. They determine the boundary of the UI component you are updating and the exact shape the server’s fragment should have.

If you use `hx-target="#results"` with `hx-swap="innerHTML"`, you are declaring that `#results` is a stable container and that the server will return content meant to live inside that container. If you instead use `hx-swap="outerHTML"`, you are declaring that the server will return the replacement element itself. These choices affect your partial templates, your selectors, and how easy the interface is to reason about later.

As you build more complex interfaces, `hx-target` can also become more local. Instead of always targeting a global `#panel`, you can target `this`, `closest tr`, or another nearby element. This is especially useful when each row in a table has its own buttons, or each item in a list can update itself independently. The lecture’s examples focus on explicit IDs first, which is the right beginner strategy, but you should know that HTMX supports richer target expressions when your UI requires them.

Likewise, swap types such as `beforeend` and `afterbegin` let you append or prepend content instead of replacing it. This becomes useful for chat messages, activity feeds, or adding items to a list. `delete` is another useful swap style when the response should cause an element to be removed from the DOM. The key is always to line up the swap type with the fragment shape the server returns.

## 14. A Practical Recipe for Building HTMX Features

When you design an HTMX feature from scratch, the most reliable approach is to begin with the UI region, not the route. Ask yourself what part of the page should change when the user interacts. If you cannot name that region clearly, you are not ready to choose a target or swap type yet.

Once you identify the region, create a partial template for it. In the lecture examples, this is why you see files like `partials/counter.ejs`, `partials/results.ejs`, `partials/form.ejs`, and `partials/success.ejs`. The partial gives the changing region a clear rendering boundary.

Then define the route that will return that partial. Decide which HTTP method fits the interaction and where the input data comes from. A search query usually arrives through `req.query` on a `GET` request. A form submission usually arrives through `req.body` on a `POST` request. A row action might use a path parameter, such as an item ID.

Only after those decisions are clear should you wire the HTML trigger with HTMX attributes. At that point the choices are straightforward: what request should this element send, what event should trigger it, what region should it target, and how should the response be swapped into the DOM?

This order of thinking produces cleaner applications because the UI region, the server route, and the fragment template are designed together rather than patched together later.

## 15. HTTP Methods and Express Routes in HTMX Apps

HTMX does not invent a new transport protocol. It uses normal HTTP requests, which means HTTP semantics still matter. In practice, this means you should use `GET` for reading or searching data and non-GET methods for actions that change server state. The lecture examples use `POST` heavily for mutations because it keeps the beginner path simple, and that is a reasonable default in this course context.

At the same time, it is useful to know that HTMX also supports `hx-put`, `hx-patch`, and `hx-delete`. Even if your exam or assignments mostly use `GET` and `POST`, understanding the broader set helps you read more realistic examples and reason about API design.

In Express, the route logic for HTMX should usually be very small: parse inputs, perform the action or query, and render the fragment. If a route starts becoming complicated, that may be a sign that business logic should move into helper functions, but the rendering pattern stays the same.

## 16. Forms, Inputs, and Data Flow: Staying Grounded in HTML

Because HTMX works so well with forms, it is worth reinforcing the normal HTML rules that still apply. Inputs must have `name` attributes if you want their values to be submitted. Forms should have a method and usually an action. Buttons inside forms should generally be `type="submit"` when they are intended to submit the form.

When the form submits, HTMX sends the request and Express receives the form data. If the server has `express.urlencoded(...)` configured, the values appear in `req.body`. From there, the server can validate, transform, and render a response fragment. In other words, the data path is still the standard web data path. HTMX changes the update behavior in the browser, not the fundamentals of form submission.

This is one reason HTMX is such a strong beginner tool. It rewards learning real HTML instead of bypassing it. Students who understand form semantics, input names, and route methods move much faster in HTMX than students who rely on memorized snippets without understanding the underlying web model.

## 17. Debugging on the Rail: Network Tab First

One of the best parts of the HTMX approach is that debugging is often straightforward. You do not need framework-specific devtools to understand what happened. The browser’s Network tab and your server logs usually tell the story.

When something is wrong, start by tracing the four-part rail. Did the trigger happen? Did a request appear in the Network tab? Was the request sent to the path and method you expected? What HTML did the server return? Did it look like a fragment or an accidental full page? Did the target selector match a real element? Was the swap type appropriate for the fragment shape?

This debugging process is especially useful in the lecture examples. In the counter app, the initial page load is a full document, but the button interactions should return only the counter fragment. In the name badge app, the HTMX request should include the `HX-Request: true` header. In the live search app, the request frequency should reflect the `delay:300ms` trigger behavior. These observations make the abstract HTMX model visible.

The most common beginner mistake in HTMX debugging is skipping directly to “HTMX is broken” when the real problem is a missing route, a misspelled target ID, an absent `name` attribute, or a fragment that does not match the intended swap type.

## 18. Common Beginner Mistakes and Why They Happen

A missing `name` attribute on an input is a classic mistake because the interface still looks correct, but the submitted data is empty. The browser only sends named form controls, so the server has nothing to read. HTMX does not change that rule.

Another common mistake is forgetting `express.urlencoded(...)` in Express. In that case, the browser sends the form data correctly, but the server never parses it into `req.body`, which makes it look like the submission failed.

Students also often return a full HTML page from an endpoint that is supposed to feed a fragment target. When HTMX swaps that full page into the middle of an existing page, the result can look broken or strangely nested. The fix is not an HTMX trick; it is simply to render the correct partial for the interaction.

Finally, many beginners mix up `innerHTML` and `outerHTML`. If the target element disappears or duplicates unexpectedly, that is often a clue that the wrong swap type was chosen for the fragment. The fastest way to fix this is to inspect the response HTML and ask whether it represents the inside of the target or the target itself.

## 19. How to Think About “State” in an HTMX Application

Students coming from JavaScript-heavy tutorials often ask where the state lives in an HTMX app. In this lecture’s model, the answer is usually simple: the meaningful state lives on the server (in memory, in a database, or in application logic), and the DOM is the browser’s current rendered representation of that state.

That does not mean there is no browser state at all. The DOM itself is state, and inputs have values, focus positions, and local UI details. But the important shift is that you do not have to invent a large client-side state system for every feature. The server computes what the UI should look like, renders HTML, and HTMX swaps it into place.

This is why HTMX can feel so clean for beginner and intermediate projects. It reduces synchronization problems because there is less duplication between a server data model and a separate client rendering model.

## 20. Preparing for the Exam: What Proficiency Looks Like

For this lecture, proficiency does not mean memorizing every HTMX attribute in the ecosystem. It means you can reason clearly about the core interaction loop and implement common patterns with confidence.

You should be able to explain the difference between HTML and the DOM, and why HTMX updates the DOM by swapping server-returned HTML fragments into a target. You should be able to compare full-page rendering and partial re-rendering and describe why partial updates can make a server-rendered application feel more interactive.

You should also be able to read and write the core HTMX attributes used in the lecture: `hx-get`, `hx-post`, `hx-trigger`, `hx-target`, and `hx-swap`. In practice, that means you should be able to look at a UI interaction and specify the trigger, the request method and path, the fragment returned by the server, the swap target, and the swap type.

On the server side, you should be comfortable writing Express routes that render both full pages and partials, parsing form data or query parameters, and applying simple validation logic that returns different fragments depending on success or failure. The validation example and the live search example are especially good study targets because they combine user input, server logic, and partial rendering in a way that mirrors realistic exam questions.

## 21. Practicing the HTMX Mindset: Page as Regions

One of the lecture’s in-class exercises asks students to analyze interactions like search, add to cart, increase quantity, and remove item by identifying the trigger, request, fragment, target, and swap type. That exercise is not just a quiz format; it is the actual design mindset HTMX encourages.

When you practice, try drawing a page and labeling independent regions such as results, cart list, cart total, and a single cart row. Then pick one interaction and describe the smallest region that truly needs to update. This step often determines whether your design stays simple or becomes tangled.

For example, if clicking a quantity `+` button should only change one row, `closest tr` plus `outerHTML` may be a better design than replacing the entire cart panel. On the other hand, if the action also changes totals and summaries in multiple places, you may choose to target a larger region first for simplicity and optimize later. The point is not to follow a rule blindly; it is to reason about rendering boundaries intentionally.

## 22. A Compact Mental Checklist for Building Real HTMX Apps

When you build an HTMX feature, it helps to carry a compact checklist in your head. First, identify the region that changes. Second, define the route and choose an HTTP method that matches the interaction. Third, design the fragment so it fits the target and swap type. Fourth, add the HTMX attributes to the HTML element that should trigger the request. Finally, test the interaction in the Network tab and inspect the response body.

This checklist is simple, but it captures the chapter’s entire narrative. It starts with UI design, moves through HTTP and server rendering, and ends with DOM swapping and debugging. That flow is exactly why HTMX fits so naturally into the lecture’s theme of rendering as a representation boundary.

## 23. Quick Reference for Review

HTMX centers on a small set of attributes. `hx-get` and `hx-post` send requests. `hx-trigger` changes when the request happens. `hx-target` chooses which part of the DOM should be updated. `hx-swap` chooses how to insert or replace the returned HTML, with `innerHTML` and `outerHTML` being the most important options to know first.

The most important live-search trigger pattern from the lecture is:

```html
hx-trigger="keyup changed delay:300ms"
```

The most important server pattern is a full-page route plus fragment routes. In Express with EJS, that often looks like an initial `GET /` that renders `index.ejs`, plus additional routes such as `POST /counter/increment` or `GET /search` that render partial templates.

The most important debugging rule is to debug the interaction in order: trigger, request, response fragment, target, swap.

## 24. Closing Perspective

HTMX is often described as “just HTML over the wire,” and that description is accurate, but it undersells what makes HTMX useful for learning. HTMX gives you a disciplined way to think about user interfaces without hiding the web platform underneath. It reinforces HTML semantics, HTTP methods, server rendering, and DOM reasoning all at once.

That is why this lecture places HTMX alongside HTML and the DOM instead of treating it as a standalone library feature list. The real lesson is not simply how to write `hx-post`. The real lesson is how to think clearly about what part of a UI changes, who renders it, and how that new representation enters the browser.

Once that clicks, HTMX becomes less of a trick and more of a method.

## References

This chapter draws on the following local course materials and external references.

Local course materials:

- <a href="/326/code/08-rendering.zip">08-rendering.zip</a>

External references:

- HTMX docs: https://htmx.org/docs/
- HTMX reference: https://htmx.org/reference/
- HTMX `hx-trigger`: https://htmx.org/attributes/hx-trigger/
- HTMX `hx-target`: https://htmx.org/attributes/hx-target/
- HTMX `hx-swap`: https://htmx.org/attributes/hx-swap/
- MDN HTML introduction: https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started
- MDN DOM overview: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model

## Version Note

The local lecture examples now pin HTMX `2.0.8` from a CDN (latest stable 2.x at the time this chapter was revised). The examples use core HTMX attributes (`hx-get`, `hx-post`, `hx-target`, `hx-swap`, `hx-trigger`) that are stable across the 1.9 and 2.x versions, and the examples were smoke-tested after the upgrade.

The HTMX project also has newer alpha work (4.x), but for course materials and exams you should treat the pinned lecture examples as the canonical reference. Focus on the concepts and attribute patterns used in the examples; those are the main learning targets.
