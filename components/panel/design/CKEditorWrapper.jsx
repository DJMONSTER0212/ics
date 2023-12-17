import React from 'react';
import { Controller } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { twMerge } from 'tailwind-merge';

const CKEditorWrapper = ({ control, name, defaultValue, placeholder, className, label, labelClassName, optional, ...rest }) => {
    let labelClassNames = 'block mb-3 text-base font-medium text-black-500 dark:text-white ';
    return (
        <div className={className}>
            {label && <label htmlFor={name} className={twMerge(labelClassNames, labelClassName)}>{label} {optional && <span className='text-sm ml-1 text-black-300'>Optional</span>}</label>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue || ''}
                render={({ field }) => (
                    <>
                        <CKEditor
                            editor={ClassicEditor}
                            data={field.value}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                field.onChange(data);
                            }}
                            config={{
                                placeholder: placeholder || 'Enter your text here...',
                            }}
                            {...rest}
                        />
                        {field.invalid && <span style={{ color: 'red' }}>{field?.message}</span>}
                    </>
                )}
            />
        </div>
    );
};

export default CKEditorWrapper;
