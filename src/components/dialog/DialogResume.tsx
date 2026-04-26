'use client'

import { Code } from '@/components/content'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { useTheme } from '@/hooks'

type HowToPrintProps = {
  isOpen: boolean
  onClose: () => void
}

export const HowToPrintDialog: React.FunctionComponent<HowToPrintProps> = ({ isOpen, onClose }) => {
  const { theme, changeTheme } = useTheme()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Want to print the resume?</DialogTitle>
          <DialogDescription className='sr-only'>Keyboard shortcuts and theme tip for printing.</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-1 text-sm'>
          <p>
            on windows or linux, press <Code>ctrl + p</Code>
          </p>
          <p>
            on mac, press <Code>⌘ + p</Code>
          </p>
        </div>

        {theme === 'dark' && (
          <div className='rounded-md bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800'>
            <strong>Note: </strong>
            For a better result, switch to light mode when you want to print my resume.{' '}
            <Button
              variant='link'
              size='sm'
              className='h-auto p-0 text-yellow-800 underline'
              onClick={changeTheme('light')}
            >
              Switch to Light Mode
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
