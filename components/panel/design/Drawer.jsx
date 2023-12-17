import React from 'react'

const Drawer = ({ drawer, setDrawer, children, title }) => {
    return (
        <div className={`${drawer && 'min-h-screen max-h-screen pb-10 w-full bg-dimBlack fixed top-0 left-0 right-0 z-50 bg-opacity-20 dark:bg-opacity-60 overflow-scroll'}`}>
            <div className={`${drawer ? 'px-4 sm:px-8 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 transition-all duration-200' : 'w-0 transition-all duration-200'}  pb-2 sm:pb-5 fixed top-0 right-0 z-50 bg-background dark:bg-dimBlack border-l border-gray-300 dark:border-black-400 max-h-screen min-h-screen overflow-scroll`}>
                <div className="flex gap-5 items-center justify-between bg-background dark:bg-dimBlack pt-4 pb-2 sm:pt-7 sm:pb-5 sticky top-0 z-10">
                    <div>
                        <h2 className='text-black-500 dark:text-white text-xl xs:text-2xl font-semibold'>{title}</h2>
                    </div>
                    <span onClick={() => setDrawer(false)} className={`block cursor-pointer w-7 h-7 text-black-500 dark:text-white group-hover:text-black-500 dark:group-hover:text-white`} dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>' }}></span>
                </div>
                {drawer && children}
            </div>
        </div>
    )
}

export default Drawer