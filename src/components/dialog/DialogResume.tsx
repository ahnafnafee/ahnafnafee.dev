'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { RESUME_PDF_URL } from '@/libs/constants/resume'

type HowToPrintProps = {
  isOpen: boolean
  onClose: () => void
}

export const HowToPrintDialog: React.FunctionComponent<HowToPrintProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Download or print</DialogTitle>
          <DialogDescription>
            The PDF keeps the original two-page résumé layout for applications and printing.
          </DialogDescription>
        </DialogHeader>

        <p className='text-sm'>To print this web page instead, use Ctrl+P on Windows or Linux, or ⌘+P on Mac.</p>

        <DialogFooter>
          <a
            className='text-primary-600 dark:text-primary-400 text-sm font-semibold underline'
            href={RESUME_PDF_URL}
            download='AhnafAnNafeeResume.pdf'
          >
            Download PDF
          </a>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
