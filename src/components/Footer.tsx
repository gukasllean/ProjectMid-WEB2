const Footer = () => {
    return (
      <div className="flex flex-col space-y-10 mt-4 p-3 bg-gray-800">
          <p className="bg-white w-fit py-2 px-4 font-bold text-gray-800 md:text-xl text-sm">Lorem Ipsum</p>
          <div className='flex flex-col space-y-10 md:mx-auto md:flex-row justify-between md:w-[1200px]'>
            <div className='flex flex-col space-y-5 text-gray-300 text-sm order-first md:order-last'>
              <p className='text-2xl font-bold'>Sign Up Today !</p>
              <p>Sign Up</p>
            </div>
            <div className='flex flex-row space-x-10 text-gray-300 text-sm order-first md:order-last'>
              <div className='flex flex-col space-y-5'>
                <a href='https://unai.edu/'>UNAI</a>
                <a href='https://fti.unai.edu/'>FTI</a>
                <a href='https://github.com/'>Github</a>
              </div>
              <div className='flex flex-col space-y-5'>
                <a href='https://tailwindcss.com/'>Tailwind</a>
                <a href='https://react.dev/'>React JS</a>
                <a href='https://axios-http.com/docs/intro'>Axios</a>
              </div>
              <div className='flex flex-col space-y-5'>
                <a href='https://tanstack.com/query/latest'>Tanstack Query</a>
                <a href='https://reactnavigation.org/'>React Navigation</a>
              </div>
            </div>
          </div>
          <div className='flex justify-between md:flex-row flex-col space-y-5'>
            <p className='font-semibold text-gray-300 text-xs leading-5'>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <p className='font-semibold text-gray-300 text-xs'>© Lorem Ipsum 2025.</p>
          </div>
      </div>
    )
  }
  
  export default Footer