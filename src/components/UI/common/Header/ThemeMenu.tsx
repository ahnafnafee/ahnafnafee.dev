import { UnstyledButton } from '@/UI//buttons'

import { twclsx } from '@/libs'

import { useTheme } from '@/hooks'

import { Spinner } from '../Spinner'

export const ThemeMenu: React.FunctionComponent = () => {
  const { theme, systemTheme, changeTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <UnstyledButton
        title='Switch theme'
        className={twclsx(
          'inline-flex items-center justify-center',
          'w-9 h-9 md:w-10 md:h-10 rounded',
          'bg-primary-100 dark:bg-theme-700'
        )}
      >
        <Spinner spinnerSize='xs' containerSize='full' containerStyle='bg-transparent dark:bg-transparent' />
        <span className='sr-only'>Switch theme</span>
      </UnstyledButton>
    )
  }

  return (
    <button
      aria-label='Toggle Dark Mode'
      type='button'
      className={twclsx(
        'inline-flex items-center justify-center',
        'w-9 h-9 md:w-10 md:h-10 rounded',
        'bg-primary-100 dark:bg-theme-700'
      )}
      onClick={changeTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          className='w-5 h-5 text-gray-800 dark:text-gray-200'
        >
          {theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
            />
          ) : (
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
            />
          )}
        </svg>
      )}
    </button>
  )
}
