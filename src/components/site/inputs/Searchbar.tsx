'use client'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import { cn } from '@/lib/utils'

import { memo } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'

interface SearchbarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
  className?: string
}

const Component: React.FunctionComponent<SearchbarProps> = ({
  onChange,
  value,
  placeholder = 'Search...',
  className
}) => {
  return (
    <InputGroup className={cn('mb-10 h-11', className)}>
      <InputGroupAddon align='inline-start'>
        <HiOutlineSearch className='text-muted-foreground' />
      </InputGroupAddon>
      <InputGroupInput
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='text-base font-medium'
      />
    </InputGroup>
  )
}

export const Searchbar = memo(Component)
