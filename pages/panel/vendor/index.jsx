import React from 'react'

const Index = () => {
    return (
        <div>index</div>
    )
}

// Layout
Index.layout = 'panelLayout';
export default Index

export async function getStaticProps(context) {
    return {
        props: {
            title: 'Dashboard'
        },
    }
}
