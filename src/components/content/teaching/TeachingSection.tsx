import { UnstyledLink } from '@/components/site/links'

import { twclsx } from '@/libs/twclsx'

import { TEACHING } from '@/data/teaching'

import type { Teaching } from 'me'

const ROLE_LABEL: Record<Teaching['role'], string> = {
  GTA: 'Graduate Teaching Assistant',
  TA: 'Teaching Assistant'
}

type GroupedCourse = {
  courseCode: string
  courseTitle: string
  description?: string
  terms: Array<{ label: string; sort: number }>
  latestSort: number
}

type GroupedInstitution = {
  institution: string
  institutionUrl?: string
  role: Teaching['role']
  latestSort: number
  courses: GroupedCourse[]
}

// Group records by (institution + role), then by course code. Each course
// keeps a deduplicated list of terms with sort keys so display order stays
// most-recent-first all the way down.
function groupTeaching(items: Teaching[]): GroupedInstitution[] {
  const byInst = new Map<string, GroupedInstitution>()

  for (const item of items) {
    const instKey = `${item.institution}|${item.role}`
    let inst = byInst.get(instKey)
    if (!inst) {
      inst = {
        institution: item.institution,
        institutionUrl: item.institutionUrl,
        role: item.role,
        latestSort: item.termSort,
        courses: []
      }
      byInst.set(instKey, inst)
    }
    inst.latestSort = Math.max(inst.latestSort, item.termSort)

    let course = inst.courses.find((c) => c.courseCode === item.courseCode)
    if (!course) {
      course = {
        courseCode: item.courseCode,
        courseTitle: item.courseTitle,
        description: item.description,
        terms: [],
        latestSort: item.termSort
      }
      inst.courses.push(course)
    }
    course.latestSort = Math.max(course.latestSort, item.termSort)
    if (!course.terms.some((t) => t.label === item.term)) {
      course.terms.push({ label: item.term, sort: item.termSort })
    }
  }

  const groups = [...byInst.values()].sort((a, b) => b.latestSort - a.latestSort)
  for (const g of groups) {
    g.courses.sort((a, b) => b.latestSort - a.latestSort)
    for (const c of g.courses) c.terms.sort((a, b) => b.sort - a.sort)
  }
  return groups
}

type Props = { className?: string }

export const TeachingSection: React.FunctionComponent<Props> = ({ className }) => {
  if (TEACHING.length === 0) return null
  const groups = groupTeaching(TEACHING)

  return (
    <section className={twclsx('border-t border-gray-200 pt-8 pb-4 dark:border-gray-800', className)}>
      <h3 className='mb-1 text-2xl font-bold tracking-tight text-black md:mb-3 dark:text-white'>Teaching</h3>
      <p className='mb-6 text-gray-600 md:mb-8 dark:text-gray-400'>Courses I&apos;ve helped run as a TA / GTA.</p>

      <ul className='flex flex-col gap-8'>
        {groups.map((g) => (
          <li key={`${g.institution}-${g.role}`} className='flex flex-col gap-4'>
            <div className='flex flex-wrap items-baseline gap-x-2 text-sm font-semibold tracking-wide text-gray-800 md:text-base dark:text-gray-200'>
              {g.institutionUrl ? (
                <UnstyledLink href={g.institutionUrl} className='hover:underline'>
                  {g.institution}
                </UnstyledLink>
              ) : (
                <span>{g.institution}</span>
              )}
              <span aria-hidden='true' className='text-gray-400 dark:text-gray-600'>
                ·
              </span>
              <span className='font-medium text-gray-600 dark:text-gray-400'>{ROLE_LABEL[g.role]}</span>
            </div>

            <ul className='flex flex-col gap-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700'>
              {g.courses.map((c) => (
                <li key={c.courseCode}>
                  <div className='mb-0.5 text-xs font-medium tracking-wide text-gray-500 uppercase md:text-sm dark:text-gray-400'>
                    {c.terms.map((t) => t.label).join(' · ')}
                  </div>
                  <div className='flex flex-wrap items-baseline gap-x-2 text-base leading-snug text-gray-900 md:text-lg dark:text-gray-100'>
                    <span className='font-bold'>{c.courseCode}</span>
                    <span aria-hidden='true' className='text-gray-400 dark:text-gray-600'>
                      —
                    </span>
                    <span>{c.courseTitle}</span>
                  </div>
                  {c.description && (
                    <p className='mt-1 text-sm leading-6 text-gray-600 md:text-base md:leading-7 dark:text-gray-400'>
                      {c.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
