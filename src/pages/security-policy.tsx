import { CustomSeo } from '@/components'
import { Footer } from '@/components/UI/common'
import { getMetaPage } from '@/libs/metapage'
import type { NextPage } from 'next'

const meta = getMetaPage({
  title: 'Security Policy - Ahnaf An Nafee',
  description: 'Security policy and responsible disclosure guidelines for ahnafnafee.dev',
  keywords: ['security policy', 'responsible disclosure', 'vulnerability reporting', 'ahnafnafee security'],
  og_image: `https://ik.imagekit.io/8ieg70pvks/site_og?ik-sdk-version=javascript-1.4.3&updatedAt=1670978636747`,
  og_image_alt: 'Security Policy - Ahnaf An Nafee',
  slug: '/security-policy',
  type: 'website'
})

const SecurityPolicy: NextPage = () => {
  return (
    <>
      <CustomSeo {...meta} />

      <main className='layout'>
        <div className='max-w-4xl mx-auto py-8'>
          <h1 className='font-bold text-3xl md:text-4xl tracking-tight mb-8 text-black dark:text-white'>
            Security Policy
          </h1>

          <div className='prose prose-gray dark:prose-invert max-w-none'>
            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Reporting Security Vulnerabilities</h2>
              <p className='mb-4'>
                I take the security of my website and services seriously. If you discover a security vulnerability, I
                appreciate your help in disclosing it to me in a responsible manner.
              </p>

              <h3 className='text-xl font-semibold mb-3'>How to Report</h3>
              <ul className='list-disc pl-6 mb-4'>
                <li>
                  Email:{' '}
                  <a href='mailto:ahnafnafee@gmail.com' className='text-primary-600 hover:text-primary-700'>
                    ahnafnafee@gmail.com
                  </a>
                </li>
                <li>
                  LinkedIn:{' '}
                  <a href='https://www.linkedin.com/in/ahnafnafee' className='text-primary-600 hover:text-primary-700'>
                    linkedin.com/in/ahnafnafee
                  </a>
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>What to Include</h2>
              <p className='mb-4'>Please include the following information in your report:</p>
              <ul className='list-disc pl-6 mb-4'>
                <li>Description of the vulnerability</li>
                <li>Steps to reproduce the issue</li>
                <li>Potential impact of the vulnerability</li>
                <li>Any suggested fixes or mitigations</li>
                <li>Your contact information for follow-up</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Response Timeline</h2>
              <ul className='list-disc pl-6 mb-4'>
                <li>
                  <strong>Initial Response:</strong> Within 48 hours of receiving your report
                </li>
                <li>
                  <strong>Assessment:</strong> Within 7 days, I will assess the vulnerability and provide an initial
                  response
                </li>
                <li>
                  <strong>Resolution:</strong> Critical vulnerabilities will be addressed within 30 days
                </li>
                <li>
                  <strong>Disclosure:</strong> After the vulnerability is fixed, we can discuss public disclosure
                </li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Scope</h2>
              <p className='mb-4'>This security policy applies to:</p>
              <ul className='list-disc pl-6 mb-4'>
                <li>
                  The main website: <code>ahnafnafee.dev</code>
                </li>
                <li>
                  All subdomains of <code>ahnafnafee.dev</code>
                </li>
                <li>Associated services and APIs</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Out of Scope</h2>
              <p className='mb-4'>The following are considered out of scope:</p>
              <ul className='list-disc pl-6 mb-4'>
                <li>Social engineering attacks</li>
                <li>Physical attacks</li>
                <li>Denial of Service (DoS) attacks</li>
                <li>Issues in third-party services not directly controlled by me</li>
                <li>Vulnerabilities requiring physical access to devices</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Recognition</h2>
              <p className='mb-4'>
                I believe in recognizing security researchers who help improve the security of my services. With your
                permission, I may acknowledge your contribution in:
              </p>
              <ul className='list-disc pl-6 mb-4'>
                <li>A security acknowledgments page</li>
                <li>Social media recognition</li>
                <li>Professional recommendations on LinkedIn</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Legal</h2>
              <p className='mb-4'>I will not pursue legal action against security researchers who:</p>
              <ul className='list-disc pl-6 mb-4'>
                <li>Follow responsible disclosure practices</li>
                <li>Do not access or modify user data</li>
                <li>Do not disrupt services</li>
                <li>Report vulnerabilities in good faith</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold mb-4'>Contact Information</h2>
              <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                <p>
                  <strong>Primary Contact:</strong>{' '}
                  <a href='mailto:ahnafnafee@gmail.com' className='text-primary-600 hover:text-primary-700'>
                    ahnafnafee@gmail.com
                  </a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{' '}
                  <a href='https://www.linkedin.com/in/ahnafnafee' className='text-primary-600 hover:text-primary-700'>
                    linkedin.com/in/ahnafnafee
                  </a>
                </p>
                <p>
                  <strong>Preferred Languages:</strong> English
                </p>
                <p>
                  <strong>Last Updated:</strong> December 2024
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default SecurityPolicy
