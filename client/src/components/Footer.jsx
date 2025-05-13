import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className='footer fixed w-full left-0 bottom-0 flex justify-center items-center py-4 bg-gray-100 border-t border-gray-200'>
        Copyright &copy; {currentYear}
    </footer>
  )
}

export default Footer