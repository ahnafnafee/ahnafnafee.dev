'use client'

import { HowToPrintDialog } from '@/components/dialog'
import { UnderlineLink } from '@/components/site/links'
import { Button } from '@/components/ui/button'

import {
  EDUCATION,
  HEADLINE,
  INDUSTRY,
  LINKS,
  PROJECTS,
  RECOGNITION,
  RESEARCH,
  RESUME_PDF_URL,
  SKILLS,
  SUMMARY,
  TEACHING,
  type ResumeEntry
} from '@/libs/constants/resume'

import { useState, type ReactNode } from 'react'
import { HiInformationCircle } from 'react-icons/hi'

function ResumeSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className='scroll-mt-24' aria-label={title}>
      <div className='border-theme-300 dark:border-theme-700 mb-5 flex items-baseline gap-3 border-b pb-2.5 print:border-neutral-300'>
        <span className='text-primary-600 dark:text-primary-400 font-mono text-xs font-bold tracking-wide print:text-black'>
          [{number}]
        </span>
        <h2 className='text-theme-900 dark:text-theme-100 text-lg font-bold tracking-tight uppercase md:text-xl print:text-black'>
          {title}
        </h2>
      </div>
      <div className='space-y-6'>{children}</div>
    </section>
  )
}

function ResumeItem({ entry }: { entry: ResumeEntry }) {
  return (
    <article className='break-inside-avoid-page'>
      <div className='flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
        <div className='min-w-0'>
          <h3 className='text-theme-900 dark:text-theme-100 text-base font-bold print:text-black'>
            {entry.href ? <UnderlineLink href={entry.href}>{entry.organization}</UnderlineLink> : entry.organization}
          </h3>
          <p className='text-theme-700 dark:text-theme-300 text-sm leading-5 italic print:text-black'>{entry.role}</p>
        </div>
        <div className='shrink-0 text-left sm:text-right'>
          <p className='text-theme-600 dark:text-theme-400 font-mono text-xs font-medium whitespace-nowrap print:text-black'>
            {entry.period}
          </p>
          <p className='text-theme-500 dark:text-theme-400 text-xs print:text-black'>{entry.location}</p>
        </div>
      </div>

      {entry.note && (
        <p className='text-theme-600 dark:text-theme-400 mt-2 font-mono text-xs tracking-wide uppercase print:text-black'>
          {entry.note}
        </p>
      )}
      {entry.description && <p className='mt-2 text-sm leading-6 print:text-black'>{entry.description}</p>}
      {entry.bullets && (
        <ul className='marker:text-primary-500 mt-2 list-disc space-y-1.5 pl-5 print:marker:text-black'>
          {entry.bullets.map((bullet) => (
            <li key={bullet} className='pl-0.5 text-sm leading-6 print:text-black'>
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {entry.links && (
        <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm'>
          {entry.links.map((link) => (
            <UnderlineLink key={link.href} href={link.href}>
              {link.label}
            </UnderlineLink>
          ))}
        </div>
      )}
    </article>
  )
}

export function ResumePageClient() {
  const [printHelpOpen, setPrintHelpOpen] = useState(false)

  return (
    <main className='text-theme-900 dark:text-theme-100 mx-auto w-[90%] max-w-3xl py-10 md:w-[86%] md:py-14 print:w-full print:max-w-none print:py-0 print:text-black'>
      <HowToPrintDialog isOpen={printHelpOpen} onClose={() => setPrintHelpOpen(false)} />

      <header className='mb-10 print:mb-6'>
        <p className='text-primary-600 dark:text-primary-400 font-mono text-xs font-bold tracking-wider uppercase print:text-black'>
          {HEADLINE.focus}
        </p>
        <h1 className='text-theme-900 dark:text-theme-100 mt-2 text-4xl font-bold tracking-tight md:text-5xl print:text-black'>
          {HEADLINE.name}
        </h1>
        <div className='mt-4 flex h-0.5 w-full gap-1' aria-hidden='true'>
          <span className='w-[16%] bg-[#00a9c8]' />
          <span className='w-[10%] bg-[#d92a91]' />
          <span className='flex-1 bg-[#3b1ef6]' />
        </div>
        <p className='mt-4 text-base font-semibold print:text-black'>{HEADLINE.title}</p>
        <div className='text-theme-600 dark:text-theme-300 mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm print:text-black'>
          <span>{HEADLINE.location}</span>
          <a className='hover:text-primary-600 hover:underline' href='tel:+15402528738'>
            {HEADLINE.phone}
          </a>
          <a className='hover:text-primary-600 hover:underline' href={`mailto:${HEADLINE.email}`}>
            {HEADLINE.email}
          </a>
        </div>
        <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm'>
          {LINKS.map((link) => (
            <UnderlineLink key={link.href} href={link.href}>
              {link.label}
            </UnderlineLink>
          ))}
        </div>
        <div className='mt-5 flex flex-wrap items-center gap-3 print:hidden'>
          <a
            href={RESUME_PDF_URL}
            download='AhnafAnNafeeResume.pdf'
            className='bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold focus-visible:ring-2'
          >
            Download résumé (PDF)
          </a>
          <Button variant='ghost' size='sm' onClick={() => setPrintHelpOpen(true)}>
            <HiInformationCircle aria-hidden='true' />
            Print options
          </Button>
        </div>
      </header>

      <div className='space-y-11 print:space-y-7'>
        <section
          aria-label='Profile'
          className='border-theme-200 bg-theme-100/60 dark:border-theme-700 dark:bg-theme-800/50 rounded-lg border p-5 print:border-0 print:bg-transparent print:p-0'
        >
          <p className='text-sm leading-7 print:text-black'>{SUMMARY}</p>
        </section>

        <ResumeSection number='01' title='Education'>
          {EDUCATION.map((entry) => (
            <ResumeItem key={`${entry.organization}-${entry.role}`} entry={entry} />
          ))}
        </ResumeSection>

        <ResumeSection number='02' title='Research experience'>
          {RESEARCH.map((entry) => (
            <ResumeItem key={`${entry.organization}-${entry.role}`} entry={entry} />
          ))}
        </ResumeSection>

        <ResumeSection number='03' title='Selected projects and evaluation'>
          {PROJECTS.map((entry) => (
            <ResumeItem key={`${entry.organization}-${entry.role}`} entry={entry} />
          ))}
        </ResumeSection>

        <ResumeSection number='04' title='Industry experience'>
          {INDUSTRY.map((entry) => (
            <ResumeItem key={`${entry.organization}-${entry.role}`} entry={entry} />
          ))}
        </ResumeSection>

        <ResumeSection number='05' title='Teaching experience'>
          {TEACHING.map((entry) => (
            <ResumeItem key={`${entry.organization}-${entry.role}`} entry={entry} />
          ))}
        </ResumeSection>

        <ResumeSection number='06' title='Technical skills and recognition'>
          <div className='space-y-2'>
            {SKILLS.map((skill) => (
              <p key={skill.name} className='text-sm leading-6 print:text-black'>
                <strong>{skill.name}:</strong> {skill.details}
              </p>
            ))}
            <p className='text-sm leading-6 print:text-black'>
              <strong>Recognition:</strong> {RECOGNITION.honors}
            </p>
            <p className='text-sm leading-6 print:text-black'>
              <strong>Languages:</strong> {RECOGNITION.languages}
            </p>
          </div>
        </ResumeSection>
      </div>
    </main>
  )
}
