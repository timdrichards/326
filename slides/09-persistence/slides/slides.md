---
theme: white
title: Lecture Title
info: |
  ## Lecture Title
  COMPSCI 326 Web Programming
class: text-2xl
transition: fade
backgroundTransition: fade
drawings:
  persist: false
mdc: true
duration: 75min
timeForPresentation: "75"
lineNumbers: true
highlighter: shiki
controls: true
progress: true
slideNumber: true
center: false
overview: true
hash: true
navigationMode: default
width: 1280
height: 720
margin: 0.08
css:
  - ./styles/main.css
  - ./styles/styles.css
---

# Lecture Title

Subtitle or module context

---

## Agenda

- Topic 1
- Topic 2
- Topic 3

---

## Callout Example

<div class="callout">
Core idea in a blue callout block.
</div>

<div class="callout callout-warn">
Warning or caution note.
</div>

<div class="callout callout-danger">
Failure mode or anti-pattern.
</div>

---

## Framed List Example

<ul class="ul-frame">
  <li>Reusable highlighted list container</li>
  <li>Good for key takeaways</li>
  <li>Works on any single list</li>
</ul>

---
class: framed-lists-green

## Slide-Wide Framed Lists

- First list item
- Second list item
- Third list item

---
layout: two-cols
class: cols-67-33

## Two Column Ratio Example

Left column content.

::right::

Right column content.

---

## Vue Component Examples

<CourseCallout title="Boundary">
Persistence should sit behind repository interfaces.
</CourseCallout>

<Counter :count="2" />

---

## Asciinema Example

<Asciinema src="/casts/demo.cast" :rows="20" />
