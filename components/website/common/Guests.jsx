import React from 'react';
import { useState, useRef, useEffect } from 'react';

const Guests = ({ petAllowed, minGuest, maxGuest, maxChild, setGuests, query }) => {
    // Guest menu states >>>>>>>>>>>>>>>>
    const [openGuestMenu, setOpenGuestMenu] = useState(false);
    const guestInputRef = useRef(null);
    const guestMenuRef = useRef(null);

    // Guest data >>>>>>>>>>>>>>>>
    const [adults, setAdults] = useState(query?.adults && Number(query.adults) || 1);
    const [childs, setChilds] = useState(query?.childs && Number(query.childs) || 0);
    const [pets, setPets] = useState(query?.pets && Number(query.pets) || 0);

    // To close guest menu >>>>>>>>>>>>>>>>>>
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guestMenuRef.current && !guestMenuRef.current.contains(event.target) && !guestInputRef.current.contains(event.target)) {
                setOpenGuestMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // To set guests to the prop >>>>>>>>>>>>>>>>>>
    useEffect(() => {
        setGuests({ adults, childs, pets })
    }, [adults, childs, pets, setGuests]);

    return (
        <div className="relative mb-3" ref={guestInputRef}>
            {/* // Guests */}
            <div onClick={() => setOpenGuestMenu(!openGuestMenu)} className={`${openGuestMenu ? 'bg-gray-50 rounded-none border-x border-t' : 'bg-white rounded-b-md border'} select-none w-full px-2 py-1 hover:bg-gray-50 cursor-pointer border-gray-300`}>
                <p className="text-base text-black-500 font-medium">Guests</p>
                <p className="text-sm text-black-300 font-normal">
                    {adults + childs} Guests {petAllowed && `and ${pets} Pets`}
                </p>
            </div>
            {/* // Guests menu */}
            <div ref={guestMenuRef}
                className={`${openGuestMenu
                    ? 'py-2 border-x border-b w-full transition-all duration-200 rounded-b-md'
                    : 'w-full h-0 overflow-hidden border-none py-0 transition-all duration-200'
                    } absolute z-10 left-0 top-13 bg-white border-gray-300 select-none grid grid-cols-1 gap-4 px-2`}
            >
                {/* // Adults selector */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-base text-black-500 font-medium">Adults</p>
                        <p className="text-xs text-black-300 font-normal">Age 13+</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div onClick={() => setAdults((prev) => Math.max(minGuest, prev - 1))} className={`border ${adults > minGuest ? 'border-black-300 hover:border-black-500' : 'border-gray-300'} rounded-md cursor-pointer w-7 h-9 flex justify-center items-center`}>
                            <p className={`text-base ${adults > minGuest ? 'text-black-500' : 'text-gray-300'} font-medium `}>
                                -
                            </p>
                        </div>
                        <p>{adults}</p>
                        <div onClick={() => setAdults((prev) => Math.min(maxGuest - childs, prev + 1))} className={`border ${adults < maxGuest - childs > 0 ? 'border-black-300 hover:border-black-500' : 'border-gray-300'} rounded-md cursor-pointer w-7 h-9 flex justify-center items-center`}>
                            <p className={`text-base ${adults < maxGuest - childs ? 'text-black-500' : 'text-gray-300'} font-medium `}>
                                +
                            </p>
                        </div>
                    </div>
                </div>
                {/* // Childs selector */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-base text-black-500 font-medium">Children</p>
                        <p className="text-xs text-black-300 font-normal">Age 2-13</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div onClick={() => setChilds((prev) => Math.max(0, prev - 1))} className={`border ${childs > 0 ? 'border-black-300 hover:border-black-500' : 'border-gray-300'} rounded-md cursor-pointer w-7 h-9 flex justify-center items-center`}>
                            <p className={`text-base ${childs > 0 ? 'text-black-500' : 'text-gray-300'} font-medium `}>
                                -
                            </p>
                        </div>
                        <p>{childs}</p>
                        <div onClick={() => setChilds((prev) => maxGuest - adults - childs > 0 && childs < maxChild ? prev + 1 : prev)} className={`border ${maxGuest - adults - childs > 0 && childs < maxChild ? 'border-black-300 hover:border-black-500' : 'border-gray-300'} rounded-md cursor-pointer w-7 h-9 flex justify-center items-center`}>
                            <p className={`text-base ${maxGuest - adults - childs > 0 && childs < maxChild ? 'text-black-500' : 'text-gray-300'} font-medium `}>
                                +
                            </p>
                        </div>
                    </div>
                </div>
                {/* // Pets selector */}
                {petAllowed &&
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-0.5">
                            <p className="text-base text-black-500 font-medium">Pets</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div onClick={() => setPets((prev) => Math.max(0, prev - 1))} className={`border ${pets > 0 ? 'border-black-300 hover:border-black-500' : 'border-gray-300'} rounded-md cursor-pointer w-7 h-9 flex justify-center items-center`}>
                                <p className={`text-base ${pets > 0 ? 'text-black-500' : 'text-gray-300'} font-medium `}>
                                    -
                                </p>
                            </div>
                            <p>{pets}</p>
                            <div onClick={() => setPets((prev) => prev + 1)} className={`border border-black-300 hover:border-black-500 rounded-md cursor-pointer w-7 h-9 flex justify-center items-center`}>
                                <p className={`text-base text-black-500 font-medium `}>
                                    +
                                </p>
                            </div>
                        </div>
                    </div>
                }
                {/* // Description */}
                <p className="text-xs font-medium">
                    This place has a maximum of {maxGuest} guest{Number(maxGuest) > 1 ? 's' : ''} including maximum of {maxChild} child{Number(maxChild) > 1 ? 's' : ''}, Pets {petAllowed ? 'Allowed' : 'Not Allowed'}.
                </p>
            </div>
        </div>
    );
};

export default Guests;
