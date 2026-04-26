'use client'

import { HowToPrintDialog } from '@/components/dialog'
import { Button } from '@/components/ui/button'

import { UnderlineLink } from '@/UI/links'

import {
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  HEADLINE,
  HONORS_AWARDS,
  LANGUAGES,
  LINKS,
  SKILLS,
  SUMMARY
} from '@/libs/constants/resume'
import htmr from '@/libs/htmr-replacement'

import { useCallback, useMemo, useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi'

export function ResumePageClient() {
  const listStyle = useMemo(() => 'list-disc list-inside [&>li]:my-2', [])
  const [popupOpen, setPopupOpen] = useState(false)

  const closePopup = useCallback(() => setPopupOpen(false), [])
  const openPopup = useCallback(() => setPopupOpen(true), [])

  return (
    <main className='layout dark:print:text-theme-800 dark:print:[&:is(h1)]:text-primary-700 py-4'>
      <HowToPrintDialog isOpen={popupOpen} onClose={closePopup} />

      <section className='mb-4 w-full'>
        <h1 className='text-center'>{HEADLINE.name}</h1>

        <div className='mt-1.5 space-x-4 text-center'>
          {LINKS.map((s) => (
            <UnderlineLink className='print:text-primary-500' key={s.href} href={s.href}>
              {s.title}
            </UnderlineLink>
          ))}
        </div>
      </section>

      <div className='space-y-8'>
        <section>
          <div className='border-b-theme-700 flex items-center justify-between gap-4 border-b-2 pb-2.5'>
            <h3>Summary</h3>

            <Button
              variant='ghost'
              size='icon-sm'
              onClick={openPopup}
              className='text-yellow-600 print:hidden'
              aria-label='How to print?'
            >
              <HiInformationCircle className='animate-pulse' />
            </Button>
          </div>

          <div className='mt-4 space-y-4'>
            <p>
              {htmr(SUMMARY.intro, {
                transform: {
                  a: (props: any) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>
                }
              })}
            </p>
            <p>{SUMMARY.experience}</p>

            <div>
              <p className='mb-2 font-bold'>Research Focus:</p>
              <ul className={listStyle + ' ml-5'}>
                {SUMMARY.researchFocus.map((item, idx) => (
                  <li key={`${idx}`}>{item}</li>
                ))}
              </ul>
            </div>

            <p>
              <strong>Technical Skills:</strong> {SUMMARY.technicalSkills}
            </p>

            <p className='text-sm italic'>{SUMMARY.outro}</p>
          </div>
        </section>
        <section>
          <h3 className='border-b-theme-700 mb-4 border-b-2 pb-2.5'>Techinal Skills</h3>

          {SKILLS.map((skill) => (
            <p className='[&:not(:first-of-type)]:mt-2.5' key={skill.name}>
              <strong>{skill.name}:</strong> {skill.list.join(', ')}.
            </p>
          ))}
        </section>

        <section>
          <div className='border-b-theme-700 flex items-center justify-between border-b-2 pb-2.5'>
            <h3>Experience</h3>
          </div>

          {EXPERIENCE.map((exp, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i} className='mt-4'>
              <div className='mb-2.5 flex items-start justify-between'>
                <div>
                  <h4>
                    {htmr(exp.companyName, {
                      transform: {
                        a: (props: any) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>
                      }
                    })}
                  </h4>
                  <h5>{exp.role}</h5>
                </div>

                <p className='text-sm font-semibold'>
                  {exp.period.start} - {exp.period.end}
                </p>
              </div>

              <ul className={listStyle}>
                {exp.lists.map((list, idx) => {
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={idx}>
                      {htmr(list, {
                        transform: {
                          a: (props: any) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>
                        }
                      })}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h3 className='border-b-theme-700 border-b-2 pb-2.5'>Education</h3>

          {EDUCATION.map((ed) => (
            <div key={ed.school} className='mt-4'>
              <div className='mb-2.5 flex items-start justify-between'>
                <h4 className='max-w-md'>{ed.school}</h4>
                <p className='self-end text-right text-sm font-semibold'>
                  {ed.period.start} - {ed.period.end}
                </p>
              </div>

              {ed.paragraphs.map((p) => (
                <p key={p}>
                  {htmr(p, {
                    transform: {
                      a: (props: any) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>,
                      i: (props: any) => <i>{props.children}</i>
                    }
                  })}
                </p>
              ))}

              {ed.list && (
                <>
                  <p>{ed.list.title}</p>
                  <ul className={listStyle}>
                    {ed.list.listItem.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </section>

        <section>
          <h3 className='border-b-theme-700 mb-4 border-b-2 pb-2.5'>Certifications</h3>

          {CERTIFICATIONS.map((cert) => (
            <div className='[&:not(:first-of-type)]:mt-2.5' key={cert.title}>
              <div className='flex items-start justify-between'>
                <div>
                  <p>
                    <strong>{cert.title}</strong>
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{cert.issuer}</p>
                </div>
                <p className='text-sm font-semibold'>{cert.date}</p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h3 className='border-b-theme-700 mb-4 border-b-2 pb-2.5'>Honors-Awards</h3>

          {HONORS_AWARDS.map((award) => (
            <div className='[&:not(:first-of-type)]:mt-2.5' key={award.title}>
              <div className='flex items-start justify-between'>
                <div>
                  <p>
                    <strong>{award.title}</strong>
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{award.issuer}</p>
                </div>
                <p className='text-sm font-semibold'>{award.date}</p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h3 className='border-b-theme-700 mb-4 border-b-2 pb-2.5'>Languages</h3>

          {LANGUAGES.map((lang) => (
            <p className='[&:not(:first-of-type)]:mt-2.5' key={lang.title}>
              <strong>{lang.title}:</strong> {lang.level}.
            </p>
          ))}
        </section>
      </div>
    </main>
  )
}
