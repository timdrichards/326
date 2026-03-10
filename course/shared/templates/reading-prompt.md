Create a beginner-friendly chapter-style reading/tutorial for a lecture topic in my course.

Goal:
Produce a single primary reading that students can use to learn the lecture material well enough to:
1. understand the concepts deeply,
2. prepare for an exam on the topic, and
3. build a working app/system using the techniques covered.

Audience:
Beginner undergraduate CS students (early web/programming experience, but new to this topic).

Output requirements:
- Write in the style of a textbook chapter, not slides or notes.
- Use paragraphs and narrative flow with transitions between ideas.
- Keep a clear “story” from fundamentals -> mental model -> examples -> practice -> exam prep.
- Use headings/subheadings, but avoid outline-heavy bullet dumping.
- Use bullets only when they genuinely improve clarity (e.g., checklists, short comparisons, references).
- Include code snippets where they support understanding, but explain them in prose.
- Make the chapter self-contained and readable on its own.
- Keep the tone beginner-friendly, clear, and rigorous.
- Explicitly connect implementation details to the underlying mental model.
- Include a short quick-reference section near the end.
- Include a references section (local materials + external docs used).
- Include a version note if library/docs versions may differ.

Consistency requirements (important for uniform course materials):
- Start with a short introduction explaining what students will learn and why it matters.
- Establish the lecture’s central theme / mental model early.
- Build from foundational concepts before tools/framework-specific details.
- Walk through local course examples as part of the narrative (not as isolated summaries).
- Include common beginner mistakes and debugging guidance.
- Include an exam-prep section describing what students should be able to explain/do.
- End with a closing perspective that ties back to the chapter’s core idea.

Source usage:
- Use the local lecture materials first (slides, code examples, notes) as the canonical course scope.
- Also use high-quality official documentation / primary sources for technical verification when appropriate.
- Do not overload with external details beyond the lecture scope.
- Align examples and terminology with the local lecture materials.

Task inputs (fill these in each time):
- Lecture title/topic: Persistence
- Course context: persistence
- Target file name: 6.9-reading.md
- Local materials to use: current folder
- External references allowed: use external books, websites, documentation as reference and include page numbers and/or links.
- Required concepts/skills students must learn: those covered in the 6.9 lecture
- Required examples/apps/patterns to cover: those covered in the 6.9 lecture
- Any course-specific conventions (frameworks, style, HTTP methods, etc.): node, typescript, htmx, express.

Formatting and deliverable:
- Write the final content directly to 6.9-reading.md
- Make it publication-ready markdown.
- Prefer narrative prose over bullets, while keeping it scannable.
- Ensure the reading can stand alone as the primary resource for this lecture.

Before writing:
1. Inspect the local lecture materials to determine exact scope and examples.
2. Identify the core mental model that unifies the lecture.
3. Structure the chapter around that mental model.

Then write the chapter.
