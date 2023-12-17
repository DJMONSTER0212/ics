import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react'

const Action = ({ row, items }) => {
    return (
        <>
            <div className="flex items-center justify-end gap-2">
                {items.map((item, index) => {
                    switch (item.name) {
                        case 'View':
                            if (item.url) {
                                return <Link key={index} href={item.url}><Image src='/panel/images/view.svg' alt={item.name} className='block max-w-none w-8 h-8 cursor-pointer' width='10' height='10' /></Link>
                            } else {
                                return <Image key={index} src='/panel/images/view.svg' onClick={item.onClick} alt={item.name} className='block max-w-none w-8 h-8 cursor-pointer' width='10' height='10' />
                            }
                        case 'Trash':
                            if (item.url) {
                                return <Link key={index} href={item.url}><Image src='/panel/images/trash.svg' alt={item.name} className='block max-w-none w-8 h-8 cursor-pointer' width='10' height='10' /></Link>
                            } else {
                                return <Image key={index} src='/panel/images/trash.svg' onClick={item.onClick} alt={item.name} className='block max-w-none w-8 h-8 cursor-pointer' width='10' height='10' />
                            }
                        case 'Edit':
                            if (item.url) {
                                return <Link key={index} href={item.url}><Image src='/panel/images/edit.svg' alt={item.name} className='block max-w-none w-8 h-8 cursor-pointer' width='10' height='10' /></Link>
                            } else {
                                return <Image key={index} src='/panel/images/edit.svg' onClick={item.onClick} alt={item.name} className='block max-w-none w-8 h-8 cursor-pointer' width='10' height='10' />
                            }
                        default:
                            return null
                    }
                })}
            </div>
        </>
    )
}

export default Action