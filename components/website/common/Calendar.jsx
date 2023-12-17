import dayjs from 'dayjs';
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { generateDate, months } from '@/util/calendardata.js';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

const Calendar = forwardRef(({ setSelectedDates, settings, query }, ref) => {
    // Calendar info >>>>>>>>>>>>>>>>>>
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [checkType, setCheckType] = useState(null);

    // Selected dates >>>>>>>>>>>>>>>>>>
    const [inDate, setInDate] = useState(query?.checkIn && dayjs(query.checkIn) || null);
    const [outDate, setOutDate] = useState(query?.checkOut && dayjs(query.checkOut) || null);
    // To handle date select >>>>>>>>>>>>>>>>>>
    const handledate = (date, validData) => {
        if (validData && checkType === 'in' && (!outDate)) {
            setInDate(date);
            setCheckType('out');
        } else if (validData && checkType === 'in' && (date < outDate)) {
            setInDate(date);
            setCheckType('out');
        } else if (validData && checkType === 'in' && (date >= outDate)) {
            setInDate(date);
            setOutDate();
            setCheckType('out');
        } else if (validData && checkType === 'out' && (date > inDate)) {
            setOutDate(date);
            setCheckType();
        } else if (validData && checkType === 'out' && (date < inDate)) {
            setOutDate(date);
            setInDate();
            setCheckType('in');
        }
    };

    // To close calendar >>>>>>>>>>>>>>>>>>
    const calendarInputRef = useRef(null);
    const calendarMenuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                calendarMenuRef.current &&
                !calendarMenuRef.current.contains(event.target) &&
                !calendarInputRef.current.contains(event.target)
            ) {
                setCheckType(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // To set dates to the prop >>>>>>>>>>>>>>>>>>
    useEffect(() => {
        setSelectedDates({ checkIn: inDate, checkOut: outDate })
    }, [inDate, outDate, setSelectedDates]);
    return (
        <>
            <div className="relative w-full mt-3" ref={calendarInputRef}>
                {/* // Check-in Check-out menu */}
                <div className="group grid grid-cols-2 items-center">
                    {/* Check-in date */}
                    <div ref={ref} onClick={() => { setCheckType((prev) => prev == 'in' ? null : 'in') }} className={`select-none cursor-pointer border-x border-t hover:bg-gray-50 border-gray-300 px-2 py-1 rounded-r-none  ${checkType === 'in' ? 'bg-gray-50' : 'bg-white'} ${checkType != null ? 'rounded-tl-md border-b-0' : 'rounded-tl-md'}`}>
                        <p className={`text-base text-black-500 font-medium`}>
                            Check in
                        </p>
                        {inDate ? (
                            <p className="text-sm text-black-300 font-normal">
                                {inDate.toDate().getDate()} {months[inDate.toDate().getMonth()]} <span className='text-xs whitespace-nowrap'>{settings.admin.booking.checkInTime || '2:00 PM'}</span>
                            </p>
                        ) : (
                            <p className="text-sm text-black-300 font-normal">Add Date</p>
                        )}
                    </div>
                    {/* Check-out date */}
                    <div onClick={() => { setCheckType((prev) => !inDate ? 'in' : prev == 'out' ? null : 'out'); }} className={`select-none cursor-pointer border-r border-t hover:bg-gray-50 border-gray-300 px-2 py-1  ${checkType === 'out' ? 'bg-gray-50' : 'bg-white'} ${checkType != null ? 'rounded-tr-md border-b-0' : 'rounded-l-0 rounded-tr-md'}`}>
                        <p className={`text-base text-black-500 font-medium`}>
                            Check out
                        </p>
                        {outDate ? (
                            <p className="text-sm text-black-300 font-normal">
                                {outDate.toDate().getDate()} {months[outDate.toDate().getMonth()]} <span className='text-xs whitespace-nowrap'>{settings.admin.booking.checkOutTime || '11:00 AM'}</span>
                            </p>
                        ) : (
                            <p className="text-sm text-black-300 font-normal">Add Date</p>
                        )}
                    </div>
                </div>
                {/* // Calendar */}
                <div className={`${checkType
                    ? 'pt-2 border-x border-b w-full transition-all duration-200'
                    : 'w-full h-0 overflow-hidden border-none py-0 transition-all duration-200'
                    } absolute z-10 top-13 rounded-x-md rounded-b-md border-gray-300 select-none overflow-hidden`}
                    ref={calendarMenuRef}
                >
                    {/* // Month selector */}
                    <div className="flex justify-between items-center bg-gray-50 p-2 -mt-2">
                        {/* Prev month */}
                        <GrFormPrevious
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => {
                                setToday(today.month(today.month() - 1));
                            }}
                        />
                        {/* Current month */}
                        <p className="text-base after:text-black-500 font-medium">
                            {months[today.month()]} {today.year()}
                        </p>
                        {/* Next month */}
                        <GrFormNext
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => {
                                setToday(today.month(today.month() + 1));
                            }}
                        />
                    </div>
                    {/* // Days */}
                    <div className="grid grid-cols-7 p-2 bg-white">
                        {days.map((day, index) => (
                            <p key={index} className="text-sm text-center place-content-center text-black-300 select-none">
                                {day}
                            </p>
                        ))}
                    </div>
                    {/* // Dates */}
                    <div className="grid grid-cols-7 p-2 bg-white">
                        {generateDate(today.month(), today.year()).map(
                            ({ date, currentMonth, today, validData }, index) => {
                                return (
                                    <div key={index} className={`flex justify-center text-sm border-t `}>
                                        <p
                                            className={`text-center
                    ${currentMonth ? '' : 'hidden'}
                    ${validData ? 'hover:bg-black-500 hover:text-white' : 'text-black-200 '}
                    ${validData && inDate && inDate.toDate().toDateString() === date.toDate().toDateString() ? 'bg-black-500 text-white' : ''}
                    ${validData && outDate && outDate.toDate().toDateString() === date.toDate().toDateString() ? 'bg-black-500 text-white' : ''}
                    ${validData && inDate && outDate && date > inDate && date < outDate && 'border border-black-300 text-black-300'}
                    w-8 h-8 rounded-md grid place-content-center  cursor-pointer select-none m-1
                  `}
                                            onClick={() => {
                                                handledate(date, validData);
                                            }}
                                        >
                                            {date.date()}
                                        </p>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>
        </>
    );
});

Calendar.displayName = 'Calendar';
export default Calendar;
