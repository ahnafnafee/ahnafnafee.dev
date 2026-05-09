import type { Teaching } from 'me'

// One record per (course, term). The renderer groups by (institution, course)
// and lists terms inline, so adding a new term to an existing course is just
// a new record — no other edits needed.
export const TEACHING: Teaching[] = [
  // George Mason University — currently teaching
  {
    institution: 'George Mason University',
    institutionUrl: 'https://gmu.edu',
    role: 'GTA',
    courseCode: 'CS 211',
    courseTitle: 'Object-Oriented Programming',
    term: 'Fall 2025',
    termSort: 202508,
    description:
      'Java fundamentals: classes, inheritance, polymorphism, generics, and event-driven GUI programming.'
  },
  {
    institution: 'George Mason University',
    institutionUrl: 'https://gmu.edu',
    role: 'GTA',
    courseCode: 'CS 211',
    courseTitle: 'Object-Oriented Programming',
    term: 'Spring 2026',
    termSort: 202601,
    description:
      'Java fundamentals: classes, inheritance, polymorphism, generics, and event-driven GUI programming.'
  },

  // Drexel University — undergraduate TA
  {
    institution: 'Drexel University',
    institutionUrl: 'https://drexel.edu',
    role: 'TA',
    courseCode: 'CS 171',
    courseTitle: 'Computer Programming I',
    term: 'Winter 2021–22',
    termSort: 202201,
    description: 'Introduction to Python: problem decomposition, control flow, and core data structures.'
  },
  {
    institution: 'Drexel University',
    institutionUrl: 'https://drexel.edu',
    role: 'TA',
    courseCode: 'CS 172',
    courseTitle: 'Computer Programming II',
    term: 'Winter 2021–22',
    termSort: 202201,
    description: 'Object-oriented design and interactive graphics in Python (PyGame).'
  },
  {
    institution: 'Drexel University',
    institutionUrl: 'https://drexel.edu',
    role: 'TA',
    courseCode: 'CS 503',
    courseTitle: 'Systems Basics',
    term: 'Spring 2021–22',
    termSort: 202204,
    description: 'C programming, the Unix environment, OS fundamentals, threads, and socket networking.'
  }
]
