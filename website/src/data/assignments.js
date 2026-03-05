import {frontMatter as homework02} from '@site/docs/homework/02/02.md';

const rawAssignments = [homework02];

const assignments = rawAssignments
  .filter(item => !item.draft && !item.unlisted)
  .map(item => ({
    id: item.id ?? item.slug ?? item.title,
    title: item.title ?? 'Untitled Assignment',
    releaseDate: item.releaseDate,
    dueDate: item.dueDate,
    link: item.slug ? `/docs${item.slug}` : '/docs/assignments',
  }));

export default assignments;
