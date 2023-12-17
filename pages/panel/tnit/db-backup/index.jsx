import React, { useState } from 'react';
import PageTitle from '@/components/panel/design/PageTitle';
import TitleDevider from '@/components/panel/design/TitleDevider';
import Button from '@/components/panel/design/Button';
import Input from '@/components/panel/design/Input';
import Error from '@/components/panel/design/Error';
import Success from '@/components/panel/design/Success';

const BackupAndRestore = () => {
    // Restore backup
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [restoreLoading, setRestoreLoading] = useState(false)
    const handleRestore = async () => {
        setRestoreLoading(true)
        try {
            if (!selectedFile) {
                setMessage({ message: 'Please select a backup file', type: 'error' })
                setRestoreLoading(false)
                return;
            }
            const formData = new FormData()
            // Add selected file to formdata
            formData.append('backup', selectedFile);

            const response = await fetch('/api/panel/db-backup/tnit/restore', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.error) {
                setMessage({ message: data.error, type: 'error' })
            } else {
                setMessage({ message: data.success, type: 'success' })
            }
        } catch (error) {
            setMessage({ message: `Restore failed ${error}`, type: 'error' })
        }
        setRestoreLoading(false)
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    // Download backup
    const [downloadLoading, setDownloadLoading] = useState(false)
    const handleDownloadBackup = async () => {
        setDownloadLoading(true)
        try {
            const response = await fetch('/api/panel/db-backup/tnit/backup', {
                method: 'GET',
            });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'backup.json';
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            setMessage({ message: 'Restore failed', type: 'error' })
        }
        setDownloadLoading(false)
    };

    return (
        <>
            <div className="px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen">
                {/* // Page title */}
                <PageTitle title={'Backup and Restore'} className='mb-3' />
                {message.type == 'error' && <Error error={message.message} />}
                {message.type == 'success' && <Success success={message.message} />}
                <div className="w-full mt-5 bg-background dark:bg-black-500 py-4 px-4 rounded-md select-none">
                    <TitleDevider title='Backup' className='mb-3' />
                    <div className="flex justify-between items-center gap-5 mb-3">
                        <p className={`text-base text-black-500 dark:text-white font-medium`}>Backups are stored daily on connected S3.</p>
                        <Button type='button' loading={downloadLoading} onClick={handleDownloadBackup} variant='primary-icon' className='text-sm py-2 px-3 bg-green-500 w-full lg:w-fit mt-3 lg:mt-0' labelClassName='whitespace-nowrap' label='Download new backup' icon={'<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z"/></svg>'} />
                    </div>
                    <TitleDevider title='Restore' className='mb-3' />
                    <Input type="file" accept=".json" onChange={handleFileChange} className='mb-3' />
                    <Button type='button' loading={restoreLoading} onClick={handleRestore} variant='primary' label='Restore backup' />
                </div>
            </div>
        </>
    );
};

// Layout
BackupAndRestore.layout = 'panelLayout';
export default BackupAndRestore
