import { memo } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'

interface SearchbarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
}

const Component: React.FunctionComponent<SearchbarProps> = ({ onChange, value, placeholder = 'Search...' }) => {
  return (
    <div className='relative w-full mb-10 group'>
       <div className="absolute inset-y-0 left-0 flex items-center pl-0 pointer-events-none">
          <HiOutlineSearch className='text-gray-400 text-xl group-focus-within:text-purple-500 transition-colors duration-300' />
       </div>
       <input 
         type="text" 
         placeholder={placeholder}
         value={value}
         onChange={onChange}
         className="block w-full pl-8 pr-4 py-3 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 bg-transparent focus:outline-none focus:border-purple-500 transition-colors duration-300 text-lg font-medium"
       />
    </div>
  )
}

export const Searchbar = memo(Component)
