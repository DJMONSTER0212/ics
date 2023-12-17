import React, { useState, useEffect, useContext } from 'react'
import { SettingsContext } from '@/conf/context/SettingsContext'

const Addons = ({ villaAddons, setAddons, addons }) => {
    const { settings } = useContext(SettingsContext);
    const [selectedAddons, setSelectedAddons] = useState(addons || []);
    // To add or remove addons >>>>>>>>>
    const click = (id) => {
        if (selectedAddons.includes(id)) {
            setSelectedAddons(selectedAddons.filter(addonId => addonId !== id));
        } else {
            setSelectedAddons([...selectedAddons, id]);
        }
    }
    // To set addons in prop >>>>>>>>>
    useEffect(() => {
        setAddons(selectedAddons)
    }, [selectedAddons, setAddons])

    return (
        <>
            {villaAddons && villaAddons.length > 0 &&
                <div className='mb-3 rounded-md bg-white border border-gray-300 grid grid-cols-1'>
                    {villaAddons.map((addon, index) => (
                        <div key={index} className={`${villaAddons.length > 1 && index < villaAddons.length - 1 && 'border-b border-gray-300 '} flex flex-col gap-1 py-2 px-3`}>
                            <div className="flex gap-2 justify-between">
                                <div className="flex flex-col">
                                    <p className='text-base text-black-500 font-medium'>{addon.name}</p>
                                    <p className='text-sm text-primary-500 font-medium'>{settings.website.currencySymbol + addon.price}</p>
                                </div>
                                {selectedAddons.includes(addon._id) && <p onClick={() => click(addon._id)} className="select-none cursor-pointer bg-primary-500 text-sm text-white px-2 py-1 h-fit rounded-md">Remove</p>}
                                {!selectedAddons.includes(addon._id) && <p onClick={() => click(addon._id)} className="select-none cursor-pointer bg-gray-300 text-sm text-black-500 px-2 py-1 h-fit rounded-md">Add</p>}
                            </div>
                            <p className='text-sm text-black-300'>{addon.shortDesc}</p>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}

export default Addons