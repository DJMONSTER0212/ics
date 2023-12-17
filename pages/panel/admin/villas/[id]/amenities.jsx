import React, { useEffect, useState } from 'react'
import Button from '@/components/panel/design/Button';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import SelectInput from '@/components/panel/design/Select';
import { components } from 'react-select';
import TitleDevider from '@/components/panel/design/TitleDevider';
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import { useRouter } from 'next/router';
import PageTitle from '@/components/panel/design/PageTitle'
import PageLinks from '@/components/panel/pageComponents/villas/admin/editVilla/PageLinks';
import Image from 'next/image';
import Unauth from '@/components/panel/design/Unauth'
import { useSession } from 'next-auth/react';

const Villa = ({ settings }) => {
    const { data: session, status } = useSession(); // Next auth
    const router = useRouter();
    const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' })
    const [loading, setLoading] = useState(true)
    const [villa, setVilla] = useState({})
    // Sortable react select >>>>>>>>>>>>>>>>>
    function arrayMove(array, from, to) {
        const slicedArray = array.slice();
        slicedArray.splice(to < 0 ? array.length + to : to, 0, slicedArray.splice(from, 1)[0]);
        return slicedArray;
    }
    const SortableMultiValue = SortableElement(props => {
        const onMouseDown = e => {
            e.preventDefault();
            e.stopPropagation();
        };
        const innerProps = { ...props.innerProps, onMouseDown };
        const { data, removeProps } = props;
        return (
            <components.MultiValue {...props} innerProps={innerProps} className='w-full bg-gray-200 dark:bg-black-400 rounded-md px-2 py-1 cursor-move'>
                <div className="flex items-center justify-between">
                    <components.MultiValueLabel>
                        <div className='flex gap-3 items-center'>
                            <Image src={data.image} alt={data.label} width='25' height='25' />
                            <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.label}</h2>
                        </div>
                    </components.MultiValueLabel>
                    <span {...removeProps} className='bg-red-200 hover:bg-red-300 rounded-md w-8 h-8 p-2 text-red-800 cursor-pointer' dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>' }}></span>
                </div>
            </components.MultiValue>
        );
    });
    const SortableMultiValueLabel = SortableHandle(props => <components.MultiValueLabel {...props} />);
    const SortableSelect = SortableContainer(SelectInput);
    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newValue = arrayMove(editAmenitiesSelectValue, oldIndex, newIndex);
        setEditAmenitiesSelectValue(newValue);
    };

    // Values for select fields >>>>>>>>>>>>>>>>>
    // Values for amenities select fields [Addons search]
    const loadAmenitiesOptions = async (inputValue) => {
        const response = await fetch(`/api/panel/amenities/admin/search?search=${inputValue}`);
        const responseData = await response.json();
        const options = responseData.data.map((amenity) => ({
            value: amenity._id,
            label: amenity.name,
            image: amenity.image,
        }));
        return options
    };

    // For submit button loading >>>>>>>>>>>>>>>>>
    const [submitLoading, setSubmitLoading] = useState(false)
    // For edit villa >>>>>>>>>>>>>>>>>
    const [editAmenitiesSelectValue, setEditAmenitiesSelectValue] = useState()
    // For edit submit
    const editSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true)
        const formData = new FormData()
        // Sending amenities array
        let amenities = JSON.stringify(editAmenitiesSelectValue.map((amenity) => amenity.value))
        // Adding data to formdata
        formData.append('amenities', amenities);
        const response = await fetch(`/api/panel/villas/admin/${villa._id}/amenities`, {
            method: "POST",
            body: formData
        })
        const responseData = await response.json()
        if (responseData.error) {
            setGlobalMessage({ message: responseData.error, type: 'error' })
        } else {
            setGlobalMessage({ message: responseData.success, type: 'success' })
        }
        setSubmitLoading(false)
    }
    // To Fetch villa amenities >>>>>>>>>>>>>>>>>
    useEffect(() => {
        const fetchVilla = async (id) => {
            setLoading(true)
            const response = await fetch(`/api/panel/villas/admin/${id}/amenities`);
            const responseData = await response.json();
            if (responseData.data) {
                setVilla(responseData.data)  // Set data in villa
                // Convert amenities in react select form
                const amenities = responseData.data.amenities.map((amenity) => ({
                    value: amenity._id,
                    label: amenity.name,
                    image: amenity.image,
                }));
                setEditAmenitiesSelectValue(amenities) // Set data in amenities
            } else {
                setGlobalMessage({ message: responseData.error, type: 'error' })
            }
            setLoading(false)
        }
        if (router.query.id) {
            fetchVilla(router.query.id);
        }
    }, [router.query.id])
    // Auth >>>>>>>>>>
    if (status === "loading") {
        return <p>Loading...</p>
    }
    if (status === "unauthenticated" || session.user.role != 'admin') {
        return <Unauth />
    }
    return (
        <div className="px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen">
            {/* Title section */}
            <PageTitle
                loading={loading}
                breadcrumbs={[
                    {
                        title: 'Villas',
                        url: '/panel/admin/villas/'
                    },
                    {
                        title: villa.name,
                        url: `/panel/admin/villas/${router.query.id}/general`
                    },
                    {
                        title: 'Amenities'
                    }
                ]}
                className='py-5'
            />
            {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
            {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
            {loading ?
                <div className='animate-pulse'>
                    <div className='flex gap-5 justify-between items-center bg-white dark:bg-dimBlack py-5'>
                        <div className="flex gap-5 items-center overflow-scroll whitespace-nowrap no-scrollbar">
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-4 w-40 rounded-md mb-3"></div>
                        </div>
                    </div>
                    <div className='w-full bg-gray-50 dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        <div className="flex gap-5 items-center mb-5">
                            <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-1 w-full rounded-md"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-black-400 h-2 w-36 rounded-md mb-3"></div>
                        <div className="bg-gray-200 dark:bg-black-400 w-full rounded-md mb-3 grid gap-1 p-1">
                            <div className="bg-gray-300 dark:bg-black-500 h-10 w-full rounded-md"></div>
                            <div className="bg-gray-300 dark:bg-black-500 h-10 w-full rounded-md"></div>
                            <div className="bg-gray-300 dark:bg-black-500 h-10 w-full rounded-md"></div>
                            <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                        </div>
                        <div className="bg-gray-200 dark:bg-black-400 h-10 w-full rounded-md"></div>
                    </div>
                </div> : Object.keys(villa).length > 0 &&
                <>
                    {/* // Action [Page links] */}
                    <PageLinks activePage='amenities' villaId={router.query.id} settings={settings} />
                    <div className='w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none'>
                        {/* // Edit form */}
                        <TitleDevider title='Manage amenities' className='mb-3' />
                        <form onSubmit={editSubmit} encType='multipart/form-data'>
                            <SortableSelect
                                AsyncSelectOn={true}
                                cacheOptions
                                useDragHandle
                                axis="xy"
                                onSortEnd={onSortEnd}
                                distance={4}
                                getHelperDimensions={({ node }) => node.getBoundingClientRect()}
                                isMulti
                                defaultOptions={true}
                                loadOptions={loadAmenitiesOptions}
                                value={editAmenitiesSelectValue}
                                onChange={(values) => { setEditAmenitiesSelectValue(values) }}
                                label="Add amenities"
                                placeholder='Search here...'
                                noOptionsMessage={() => 'Type to see amenities..'}
                                components={{
                                    Option: ({ data, ...props }) => {
                                        return (
                                            <components.Option {...props}>
                                                <div className='flex gap-3 items-center'>
                                                    <Image src={data.image} alt={data.label} width='25' height='25' />
                                                    <h2 className="text-base font-medium text-gray-800 dark:text-white flex gap-2 items-center">{data.label}</h2>
                                                </div>
                                            </components.Option>
                                        );
                                    },
                                    MultiValue: SortableMultiValue,
                                    MultiValueLabel: SortableMultiValueLabel,
                                    MultiValueRemove: () => { },
                                    ClearIndicator: () => { }
                                }}
                                closeMenuOnSelect={false}
                            />
                            <p className={`mt-2 mb-3 text-base text-green-600 dark:text-green-400 font-medium`}>Tip: <span className='text-black-500 dark:text-white font-normal'>Hold and move cursor on amenities to reorder them.</span></p>
                            <Button type='submit' loading={submitLoading} variant='primary' label='Update amenities' />
                        </form>
                    </div>
                </>
            }
        </div>
    )
}

// Layout
Villa.layout = 'panelLayout';
export default Villa

// Passing props to layout
export async function getServerSideProps(context) {
    // Connect to DB
    await connectDB();
    // Fetch settings
    const settings = await settingsModel.findOne().lean();
    return {
        props: {
            settings: JSON.parse(JSON.stringify(settings))
        },
    }
}