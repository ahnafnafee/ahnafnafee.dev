import { CustomSeo } from '@/components'
import { AlertResume, HowToPrintDialog } from '@/components/dialog'

import { UnstyledButton } from '@/UI/buttons'
import { UnderlineLink } from '@/UI/links'

import { EDUCATION, EXPERIENCE, HEADLINE, LANGUAGES, LINKS, SKILLS, SUMMARY } from '@/libs/constants/resume'
import { generateOgImage, getMetaPage } from '@/libs/metapage'

import htmr from 'htmr'
import type { NextPage } from 'next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi'

const meta = getMetaPage({
  title: 'Resume',
  description: 'Professional Resume of Ahnaf An Nafee',
  keywords: ['Ahnaf An Nafee', 'resume', 'curriculum vitae', 'Ahnaf An Nafee cv', 'Ahnaf An Nafee resume', 'cv'],
  og_image: generateOgImage({ title: 'Resume - ahnafnafee.dev', subTitle: 'Take a look at my resume' }),
  og_image_alt: 'Resume — ahnafnafee.dev',
  slug: '/resume',
  type: 'website'
})

const Resume: NextPage = () => {
  const listStyle = useMemo(() => 'list-disc list-inside [&>li]:my-2', [])
  // const isMatch = useMediaQuery('(min-width: 768px)')
  const isMatch = true
  const [modal, setModal] = useState({ alert: false, popup: false })

  const closePopup = useCallback(() => setModal((prev) => ({ ...prev, popup: false })), [])
  const openPopup = useCallback(() => setModal((prev) => ({ ...prev, popup: true })), [])
  const closeAlert = useCallback(() => setModal((prev) => ({ ...prev, alert: false })), [])
  const openAlert = useCallback(() => setModal((prev) => ({ ...prev, alert: true })), [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMatch) {
        closeAlert()
      }

      if (!isMatch) {
        openAlert()
      }
    }, 100)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMatch])

  return (
    <main className='py-4 dark:print:text-theme-800 dark:print:[&:is(h1)]:text-primary-700'>
      <CustomSeo {...meta} />

      <HowToPrintDialog isOpen={modal.popup} onClose={closePopup} />
      {modal.alert && <AlertResume isOpen={modal.alert} onClose={closeAlert} />}

      <section className='w-full mb-4'>
        <h1 className='text-center'>{HEADLINE.name}</h1>

        <div className='space-x-4 text-center mt-1.5'>
          {LINKS.map((s) => (
            <UnderlineLink className='print:text-primary-500' key={s.href} href={s.href}>
              {s.title}
            </UnderlineLink>
          ))}
        </div>
      </section>

      <div className='space-y-8'>
        <section>
          <div className='flex items-center justify-between pb-2.5 border-b-2 border-b-theme-700'>
            <h3>Summary</h3>

            <UnstyledButton onClick={openPopup} className='print:hidden'>
              <HiInformationCircle className='text-yellow-600 animate-pulse text-lg' />
              <span className='sr-only'>How to print?</span>
            </UnstyledButton>
          </div>

          <ul className={listStyle}>
            {SUMMARY.map((summ, idx) => {
              return (
                <li key={idx}>
                  {htmr(summ, {
                    transform: {
                      a: (props) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>
                    }
                  })}
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <h3 className='mb-4 pb-2.5 border-b-2 border-b-theme-700'>Techinal Skills</h3>

          {SKILLS.map((skill) => (
            <p className='[&:not(:first-of-type)]:mt-2.5' key={skill.name}>
              <strong>{skill.name}:</strong> {skill.list.join(', ')}.
            </p>
          ))}
        </section>

        <section>
          <div className='flex items-center justify-between pb-2.5 border-b-2 border-b-theme-700'>
            <h3>Experience</h3>
          </div>

          {EXPERIENCE.map((exp, i) => (
            <div key={i} className='mt-4'>
              <div className='flex items-start justify-between mb-2.5'>
                <div>
                  <h4>
                    {htmr(exp.companyName, {
                      transform: {
                        a: (props) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>
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
                    <li key={idx}>
                      {htmr(list, {
                        transform: {
                          a: (props) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>
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
          <h3 className='pb-2.5 border-b-2 border-b-theme-700'>Education</h3>

          {EDUCATION.map((ed) => (
            <div key={ed.school} className='mt-4'>
              <div className='flex items-start justify-between mb-2.5'>
                <h4 className='max-w-md'>{ed.school}</h4>
                <p className='text-sm font-semibold self-end text-right'>
                  {ed.period.start} - {ed.period.end}
                </p>
              </div>

              {ed.paragraphs.map((p) => (
                <p key={p}>
                  {htmr(p, {
                    transform: {
                      a: (props) => <UnderlineLink href={props.href ?? ''}>{props.children}</UnderlineLink>,
                      i: (props) => <i>{props.children}</i>
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
          <h3 className='mb-4 pb-2.5 border-b-2 border-b-theme-700'>Languages</h3>

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

export default Resume
