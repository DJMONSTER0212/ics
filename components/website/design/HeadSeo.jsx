import React from 'react'
import Head from 'next/head'

const HeadSeo = ({ title }) => {
    return <Head>
        <title>{title}</title>
    </Head>
}

export default HeadSeo