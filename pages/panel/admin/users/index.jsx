import React, { useState, useRef } from 'react'
import Table from '@/components/panel/design/table/Table'
import Button from '@/components/panel/design/Button'
import Action from '@/components/panel/design/table/Action'
import Image from 'next/image'
import Error from '@/components/panel/design/Error'
import { useSession } from 'next-auth/react'
import Success from '@/components/panel/design/Success'
import { useRouter } from 'next/router';
import Unauth from '@/components/panel/design/Unauth'
import AddUser from '@/components/panel/pageComponents/users/admin/AddUser'
import EditUser from '@/components/panel/pageComponents/users/admin/EditUser'
import DeleteUser from '@/components/panel/pageComponents/users/admin/DeleteUser'
import PageTitle from '@/components/panel/design/PageTitle'
import settingsModel from '@/models/settings.model'
import connectDB from '@/conf/database/dbConfig'
import PageLinks from '@/components/panel/pageComponents/users/admin/Pagelinks'

const Users = ({ settings }) => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Next auth
  const [globalMessage, setGlobalMessage] = useState('') // Global Error/Success Message
  const ref = useRef() // To get child component function (From table component reFetch)

  // For table >>>>>>>>>>>>>>>>
  const [columns, setColumns] = useState([
    {
      Header: 'User',
      accessor: 'name',
      Cell: ({ value, row }) => {
        return <div className="flex items-center gap-x-2">
          <Image className="object-cover w-8 h-8 rounded-full" src={row.original.image} width='35' height='35' alt="x" />
          <div>
            <h2 className="text-sm font-medium text-gray-800 dark:text-white flex gap-2 items-center">{value}</h2>
            <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{row.original.email}</p>
          </div>
        </div>
      },
    },
    {
      Header: 'Role',
      accessor: 'role',
      Cell: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1),
      disableSortBy: true,
    },
    {
      Header: 'Verified',
      accessor: 'verified',
      Cell: ({ value }) => value ? <p className="text-base font-medium w-fit text-green-600 flex gap-2 items-center">Verified <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-4 w-4 bi bi-patch-check-fill" viewBox="0 0 16 16"><path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" /></svg></p> : <p className="text-base font-medium w-fit text-red-500 dark:text-red-300 flex gap-2 items-center">Not verified <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 bi bi-emoji-frown-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-2.715 5.933a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z" /></svg></p>,
      disableSortBy: true,
    },
    {
      Header: 'Status',
      accessor: 'block',
      Cell: ({ value }) => value ? <p className="text-sm font-medium w-fit bg-red-100 px-3 py-1 rounded-md text-red-500">Blocked</p> : <p className="text-sm font-medium w-fit bg-green-200 px-3 py-1 rounded-md text-green-700">Active</p>,
      disableSortBy: true,
    },
    {
      Header: 'Joined on',
      accessor: 'createdAt',
      Cell: ({ value }) => value ? new Date(value).toUTCString().slice(0, 16) : 'No date found',
      disableSortBy: true,
    },
    {
      Header: '',
      accessor: 'Action',
      disableSortBy: true,
      Cell: ({ row }) => {
        const actionItems = [
          {
            name: 'Edit',
            onClick: () => { editFetch(row.original._id) }
          },
          {
            name: 'Trash',
            onClick: () => { deleteFetch(row.original._id) }
          }
        ]
        return <Action items={actionItems} />
      },
    },
  ])
  // API Url
  const [url, setUrl] = useState('/api/panel/users/admin?')
  // Search options
  const searchOptions = [
    {
      name: 'All',
      value: 'all',
      placeholder: 'Enter name or email or phone number...'
    },
    {
      name: 'Name',
      value: 'name',
      placeholder: 'Enter name...'
    },
    {
      name: 'Email',
      value: 'email',
      placeholder: 'Enter email...'
    },
    {
      name: 'Phone number',
      value: 'phone',
      placeholder: 'Enter phone number...'
    }
  ]
  // To refetch the table
  const handleReFetch = () => {
    if (ref.current) {
      ref.current.reFetch();
    }
  };

  // For current action type [all, blocked, etc] >>>>>>>>>>>>>>>>
  const [userType, setUserType] = useState('all')
  const updateUserType = (userType) => {
    //  To change user fetch url for table
    setUrl(`/api/panel/users/admin/?userType=${userType}&`)
    setUserType(userType)
    setGlobalMessage('') // Clear any global Error/Success message
  }

  // For add user >>>>>>>>>>>>>>>>
  const [addUserDrawer, setAddUserDrawer] = useState(false)
  const [addMessage, setAddMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
  // Add user onclick
  const onClickAddUser = () => {
    setAddMessage('');
    setAddUserDrawer(!addUserDrawer)
  }

  // For edit user >>>>>>>>>>>>>>>>
  const [editMessage, setEditMessage] = useState({ message: '', type: '' }) // Edit Error/Success Message
  const [editUserDrawer, setEditUserDrawer] = useState(false)
  const [editUserId, setEditUserId] = useState()
  // Edit fetch
  const editFetch = (id) => {
    setEditUserId(id)
    setEditUserDrawer(true)
  }

  // For delete user >>>>>>>>>>>>>>>>
  const [deleteMessage, setDeleteMessage] = useState({ message: '', type: '' }) // Delete Error/Success Message
  const [deleteUserDrawer, setDeleteUserDrawer] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState()
  // Delete fetch
  const deleteFetch = (id) => {
    setDeleteUserId(id)
    setDeleteUserDrawer(true)
  }

  // Auth >>>>>>>>>>>>>
  if (status === "loading") {
    return <p>Loading...</p>
  }
  if (status === "unauthenticated" || session.user.role != 'admin') {
    return <Unauth />
  }

  return (
    <>
      <div className='px-4 sm:px-8 bg-white dark:bg-black-600 rounded-md h-auto min-h-screen'>
        {/* Title section */}
        <PageTitle
          title={'Users'}
        />
        {/* // Action */}
        <div className='flex flex-col sm:flex-row gap-5 justify-start sm:justify-between items-start sm:items-center bg-white dark:bg-black-600 mb-5 pt-5'>
          <PageLinks
            activePage={userType}
            settings={settings}
            updateUserType={updateUserType}
          />
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant='primary-icon' onClick={onClickAddUser} className='w-auto text-sm py-2' labelClassName='sm:hidden lg:block whitespace-nowrap' label='Add new' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>'} />
            {/* <Button variant='secondary-icon' className='w-auto text-sm py-2 min-h-[35.2px]' icon={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>'} /> */}
          </div>
        </div>
        {/* // Messages */}
        {globalMessage.type == 'error' && <Error error={globalMessage.message} />}
        {globalMessage.type == 'success' && <Success success={globalMessage.message} />}
        {/* // Users Table */}
        <Table columns={columns} url={url} ref={ref} searchOptions={searchOptions} query={router.query} key={router.asPath}></Table>
      </div>
      {/* // Add User Drawer */}
      <AddUser
        addUserDrawer={addUserDrawer}
        setAddUserDrawer={setAddUserDrawer}
        addMessage={addMessage}
        setAddMessage={setAddMessage}
        settings={settings}
        reFetch={handleReFetch}
      />
      {/* // Edit user */}
      <EditUser
        editUserDrawer={editUserDrawer}
        setEditUserDrawer={setEditUserDrawer}
        editMessage={editMessage}
        setEditMessage={setEditMessage}
        editUserId={editUserId}
        setGlobalMessage={setGlobalMessage}
        reFetch={handleReFetch}
        session={session}
        settings={settings}
      />
      {/* // Delete user */}
      <DeleteUser
        deleteUserDrawer={deleteUserDrawer}
        setDeleteUserDrawer={setDeleteUserDrawer}
        deleteMessage={deleteMessage}
        setDeleteMessage={setDeleteMessage}
        setGlobalMessage={setGlobalMessage}
        reFetch={handleReFetch}
        deleteFetch={deleteFetch}
        deleteUserId={deleteUserId}
        session={session}
      />
    </>
  )
}


// Layout
Users.layout = 'panelLayout';
export default Users

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