import React from 'react'
import Image from 'next/image'
import Input from './Input'
import { twMerge } from 'tailwind-merge'
import { ReactSortable } from "react-sortablejs";
import Error from '@/components/panel/design/Error';

const FileUpload = ({ multiple, images, maxImage, register, setValue, setMessage, errors, name, label, disabled, imageGridClassNames, className, inputClassNames, labelClassName, imageSize, imageSizeClassName, validationOptions, optional }) => {
    // Add images of input
    const addImages = (event, images, setValue, setMessage) => {
        const newImages = event.target.files;
        const imagesArray = Array.from(newImages);
        if (imagesArray.length + images.length > maxImage) {
            setMessage({ message: `Max ${maxImage} Images allowed.`, type: 'error' })
        } else {
            setValue("images", [...images, ...imagesArray]);
        }
    };

    // Remove images
    const removeImage = (index, images, setValue, setMessage) => {
        if (images.length == 1) {
            setMessage({ message: `Minimum 1 image is required.`, type: 'error' })
        } else {
            setValue("images", images.filter((element, i) => i !== index));
        }
    }
    // Update images on reorder
    const updateImages = (values) => {
        setValue("images", values);
    }
    if (multiple == true) {
        return (
            <>
                {images && images.length != 0 && images.length <= maxImage &&
                    <ReactSortable disabled={disabled} list={images} setList={updateImages} className={twMerge('grid gap-3 grid-cols-2 ', imageGridClassNames)}>
                        {images.map((image, index) => (
                            <div key={index} className='relative'>
                                <Image src={image instanceof Blob ? URL.createObjectURL(image) : image.toString()} alt='Property image' height={321} width={500} priority className='rounded-md w-full h-full object-cover cursor-move' />
                                <span onClick={() => removeImage(index, images, setValue, setMessage)} className='absolute top-1 right-1 bg-red-500 text-white p-2 rounded-md cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" /></svg></span>
                            </div>
                        ))}
                    </ReactSortable>
                }
                <Input
                    type='file'
                    accept="image/*,.svg"
                    className={className}
                    inputClassName={inputClassNames}
                    labelClassName={labelClassName}
                    multiple={true}
                    optional={optional}
                    validationOptions={validationOptions}
                    name={name}
                    label={label}
                    onChange={(e) => { addImages(e, images, setValue, setMessage) }}
                />
                {imageSize && <p className={twMerge('text-base font-normal text-black-400 dark:text-black-100 mt-2', imageSizeClassName)}>Image size: {imageSize} </p>}
                {errors && errors[`${name}`] && <Error error={errors[`${name}`].message} className='mb-3 py-1 text-base' />}
            </>
        )
    } else {
        return (
            <>
                {images && <Image src={typeof images == 'string' ? images : URL.createObjectURL(images[0])} width='250' height='100' alt="x" className={twMerge("object-cover w-12 h-12 rounded-md mb-3", imageGridClassNames)} />}
                <Input
                    type='file'
                    accept="image/*,.svg"
                    register={register}
                    validationOptions={validationOptions}
                    className={className}
                    inputClassName={inputClassNames}
                    labelClassName={labelClassName}
                    optional={optional}
                    name={name}
                    label={label}
                />
                {imageSize && <p className={twMerge('text-base font-normal text-black-400 dark:text-black-100 mt-2', imageSizeClassName)}>Image size: {imageSize} </p>}
                {errors && errors[`${name}`] && <Error error={errors[`${name}`].message} className='mb-3 py-1 text-base' />}
            </>
        )
    }
}

export default FileUpload
