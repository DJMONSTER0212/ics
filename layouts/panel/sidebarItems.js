const sidebarItems = {
    // Tnit Sidebar Items
    tnit: [
        { variant: 'normal', title: 'Users', path: '/panel/tnit/users', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>' },
        { variant: 'normal', title: 'Settings', path: '/panel/tnit/settings', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg>' },
        { variant: 'normal', title: 'DB Backups', path: '/panel/tnit/db-backup', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16"><path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/></svg>' },
    ],
    // Admin Sidebar Items
    admin: [
        { variant: 'normal', title: 'Dashboard', path: '/panel/admin/dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)"><path fill="currentcolor" d="M3 11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6Zm0 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4Zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v7Zm2-17a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h5a2 2 0 0 0 2-2V4a1 1 0 0 0-1-1h-5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>' },
        { variant: 'normal', title: 'Users', path: '/panel/admin/users', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>' },
        { variant: 'normal', title: 'Amenities', path: '/panel/admin/amenities', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-stars" viewBox="0 0 16 16"><path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/></svg>' },
        { variant: 'normal', title: 'Locations', path: '/panel/admin/locations', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>' },
        { variant: 'normal', title: 'Villas', path: '/panel/admin/villas', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M22 21.249h-1V9.979c0-.62-.28-1.2-.77-1.58L19 7.439l-.02-2.45c0-.55-.45-.99-1-.99h-3.41l-1.34-1.04c-.72-.57-1.74-.57-2.46 0l-7 5.44c-.49.38-.77.96-.77 1.57l-.05 11.28H2c-.41 0-.75.34-.75.75s.34.75.75.75h20c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Zm-15.5-8.5v-1.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v1.5c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1Zm8 8.5h-5v-2.75c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5v2.75Zm3-8.5c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v1.5Z"/></svg>' },
        // { variant: 'normal', title: 'Hotels', path: '/panel/admin/hotels', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" xml:space="preserve" viewBox="0 0 512 512"><path d="M366.933 460.8h-14.967l6.434-28.945a358.384 358.384 0 0 0 8.533-77.713c0-20.361-1.937-40.832-5.743-60.817-16.324-85.751-59.076-159.087-120.371-206.498-17.655-13.653-38.434-24.653-61.619-32.998V8.533A8.536 8.536 0 0 0 170.667 0a8.536 8.536 0 0 0-8.533 8.533V460.8h-17.067a8.536 8.536 0 0 0-8.533 8.533v34.133a8.536 8.536 0 0 0 8.533 8.533h221.867a8.536 8.536 0 0 0 8.533-8.533v-34.133c0-4.71-3.823-8.533-8.534-8.533zM204.8 170.667a8.536 8.536 0 0 1 8.533-8.533h39.142a8.549 8.549 0 0 1 6.724 3.277c10.718 13.696 20.284 28.621 28.595 44.51.017.043.051.077.068.119 7.049 13.5 13.073 27.759 18.227 42.496.068.145.102.299.162.444 4.966 14.259 9.122 28.971 12.194 44.1 3.208 15.812 5.82 43.307 5.82 61.278a267.91 267.91 0 0 1-5.197 52.463l-9.993 49.98h-17.408l5.12-25.6h-74.923v25.6H204.8V170.667zm153.6 324.266H153.6v-17.067h204.8v17.067z"/><path d="M221.868 418.138h78.336l2.133-10.667c.99-4.941 1.775-9.933 2.466-14.933h-82.935v25.6zm81.07-110.837-81.075-.094v25.591h84.087c-.76-8.985-1.801-17.979-3.012-25.497zm-81.071 68.162h84.676c.393-5.7.657-11.401.657-17.109 0-2.628-.077-5.513-.188-8.491h-85.146v25.6zm70.337-110.93h-70.34v25.609l77.5.085c-2.065-8.712-4.42-17.297-7.16-25.694zM248.279 179.2h-26.411v25.6h43.52c-5.282-8.926-10.973-17.502-17.109-25.6zm26.433 42.667h-52.847v25.6h64.205c-3.431-8.773-7.194-17.332-11.358-25.6z"/></svg>' },
        { variant: 'normal', title: 'Villa Bookings', path: '/panel/admin/villa-bookings', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 10V7a1 1 0 0 1 1-1h1.813M4.5 10v10a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V10m-15 0h15m0 0V7a1 1 0 0 0-1-1h-2.281M7.312 6V3m0 3h8.907m0 0V3M8 14h8"/></svg>' },
        {
            variant: 'dropdown', title: 'Templates', path: '/panel/admin/template/', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M20.889 23.222H3.11A1.111 1.111 0 0 1 2 22.112V8.666a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1V22.11a1.111 1.111 0 0 1-1.111 1.111ZM22 4.444a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2.111A1.111 1.111 0 0 1 3.111 1H20.89A1.111 1.111 0 0 1 22 2.111v2.333ZM7.444 11a1 1 0 0 0-1 1v2.444a1 1 0 0 0 1 1H9.89a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1H7.444Zm0 6.667a1 1 0 0 0-1 1v.222a1 1 0 0 0 1 1h9.112a1 1 0 0 0 1-1v-.222a1 1 0 0 0-1-1H7.444Zm6.667-5.556a1 1 0 0 0-1 1v.222a1 1 0 0 0 1 1h2.445a1 1 0 0 0 1-1v-.222a1 1 0 0 0-1-1H14.11Z"/></svg>',
            subItems: [
                {
                    title: 'Mail templates',
                    path: '/panel/admin/template/mail-template'
                },
            ]
        },
        {
            variant: 'dropdown', title: 'Payments', path: '/panel/admin/payments', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21.988 10.995v5.28a2.75 2.75 0 0 1-2.582 2.746l-.167.005H4.76a2.75 2.75 0 0 1-2.745-2.583l-.005-.167v-5.281h19.977ZM18.253 14.5h-2.5l-.102.007a.75.75 0 0 0 0 1.486l.102.007h2.5l.102-.007a.75.75 0 0 0 0-1.486l-.102-.007Zm.986-9.48a2.75 2.75 0 0 1 2.745 2.583l.005.168v1.724H2.01l.001-1.724a2.75 2.75 0 0 1 2.583-2.745l.167-.005h14.478Z"/></svg>',
            subItems: [
                {
                    title: 'Payments',
                    path: '/panel/admin/payments/'
                },
                {
                    title: 'Taxes',
                    path: '/panel/admin/payments/taxes'
                },
                {
                    title: 'Settings',
                    path: '/panel/admin/payments/settings/payout'
                },
            ]
        },
        { variant: 'normal', title: 'Contacts', path: '/panel/admin/contacts', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/></svg>' },
        {
            variant: 'dropdown', title: 'Promotions', path: '/panel/admin/promotions/', icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M17.1 14.95c.412.16.9-.08.9-.45v-13c0-.37-.488-.61-.9-.45-.683.41-1.311.83-1.919 1.237-2.14 1.43-4.019 2.687-7.084 2.713H4C2.34 5 1 6.34 1 8s1.34 3 3 3h4c3.123 0 5.02 1.268 7.182 2.714.607.406 1.236.826 1.918 1.236zM9 18h-.79c-.43 0-.81-.27-.94-.67L5.07 13H9a1 1 0 011 1v3c0 .55-.45 1-1 1z" fill="currentColor"></path></g></svg>',
            subItems: [
                {
                    title: 'Homepage banners',
                    path: '/panel/admin/promotions/homepage-banners'
                },
                {
                    title: 'Coupons',
                    path: '/panel/admin/promotions/coupons'
                },
            ]
        },
        { variant: 'normal', title: 'Settings', path: '/panel/admin/settings/website', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg>' },
        // { variant: 'withMessage', title: 'Update', message: 'V 0.2', path: '/panel/admin/update', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-arrow-up-fill" viewBox="0 0 16 16"><path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM7.5 6.707 6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707z"/></svg>' },
        // { variant: 'withMessage', title: 'Bookings', message: '12', path: '/panel/admin/booking', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-calendar-event-fill" viewBox="0 0 16 16"><path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/></svg>' },
    ],

    // Vendor Sidebar Items
    vendor: [
        { variant: 'normal', title: 'Dashboard', path: '/panel/vendor', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)"><path fill="currentcolor" d="M3 11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6Zm0 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4Zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v7Zm2-17a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h5a2 2 0 0 0 2-2V4a1 1 0 0 0-1-1h-5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>' },
        { variant: 'normal', title: 'Properties', path: '/panel/vendor/properties', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-building-fill" viewBox="0 0 16 16"><path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H3Zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Z"/></svg>' },
        {
            variant: 'dropdown', title: 'Room managment', path: '/panel/vendor/rooms', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-door-open-fill" viewBox="0 0 16 16"><path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/></svg>',
            subItems: [
                {
                    title: 'Rooms',
                    path: '/panel/vendor/rooms'
                },
                {
                    title: 'Addons',
                    path: '/panel/vendor/rooms/addons'
                },
            ]
        },
    ],

    // Customer Sidebar Items
    customer: [
        { variant: 'withMessage', title: 'Update', message: 'V 0.2', path: '/panel/admin/update', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-arrow-up-fill" viewBox="0 0 16 16"><path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM7.5 6.707 6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707z"/></svg>' },
    ],
    // User Sidebar Items
    user: [
        { variant: 'withMessage', title: 'Update', message: 'V 0.2', path: '/panel/admin/update', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-arrow-up-fill" viewBox="0 0 16 16"><path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM7.5 6.707 6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707z"/></svg>' },
    ],
};

export default sidebarItems;