import React from 'react';
import moment from 'moment';
import { Page, Text, View, Document, Image, Link, Font } from '@react-pdf/renderer';

const TitleDevider = ({ title }) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <Text style={{ fontSize: '12px', color: 'gray' }}>{title}</Text>
            <View style={{ flex: 1, alignItems: 'center', height: '0.5px', backgroundColor: '#e5e7eb' }} />
        </View>
    )
}
const Invoice = ({ booking, settings, websiteUrl }) => {
    // Register fonts to react pdf >>>>>>>>>>
    Font.register({
        family: 'InterBold',
        src: '/pdf-font/Inter-Bold.ttf'
    })
    Font.register({
        family: 'InterSemiBold',
        src: '/pdf-font/Inter-SemiBold.ttf'
    });
    Font.register({
        family: 'InterMedium',
        src: '/pdf-font/Inter-Medium.ttf'
    });
    Font.register({
        family: 'InterRegular',
        src: '/pdf-font/Inter-Regular.ttf'
    });

    return (
        <Document pageMode='fullScreen' pageLayout='singlePage' id="invoiceView">
            <Page size='A4' style={{ width: '100%', padding: '20px' }} className="p-5">
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ gap: '5px' }}>
                        <Text style={{ fontSize: 20, textAlign: 'left', fontFamily: 'InterSemiBold' }}>Invoice</Text>
                        <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px', textAlign: 'left' }} >Your invoice for booking ID: <Text style={{ fontWeight: '500', color: 'black' }}>{booking._id}</Text></Text>
                    </View>
                    {/* // Logo */}
                    <View>
                        <Link href='/'><Image src={settings.website?.lightLogo} alt='Logo' style={{ height: '30px', width: 'auto' }} className='basis-1 lg:basis-0 order-1 block max-h-10 lg:max-h-12 w-auto max-w-full' /></Link>
                    </View>
                </View>
                <View style={{ border: '0.5px solid #e5e7eb', borderRadius: '5px', padding: '10px', marginTop: '10px' }}>
                    {/* // Basic info */}
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
                        <View style={{ gap: '5px' }}>
                            <Text style={{ fontSize: '14px', color: 'black', fontFamily: 'InterSemiBold' }}>Booking Confirmation Voucher ID</Text>
                            <Text style={{ fontSize: '12px', fontFamily: 'InterMedium', color: 'black' }}><Text >{booking._id}</Text></Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', gap: '3px' }} >
                            <Text style={{ fontSize: '12px', color: 'rgb(117 117 117)' }}>Booked for <Text style={{ color: 'black' }} >{booking.mainGuestInfo.name}</Text> on {moment(booking.createdAt).format("DD MMM YYYY")}</Text>
                            <Text style={{ fontSize: '12px', color: 'rgb(117 117 117)' }} ><Text style={{ color: 'black' }} >Email:</Text> {booking.mainGuestInfo.email}</Text>
                        </View>
                    </View>
                    {/* // Villa info */}
                    <View style={{ gap: '10', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', paddingTop: '10px' }}>
                        {/* Details */}
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {/* Title */}
                            <Text className='text-xl text-black-500 font-bold line-clamp-2' style={{ fontSize: '14px', marginLeft: '-5px', fontFamily: 'InterSemiBold' }}>{booking.villa.name}, {booking.villa.location.name}</Text>
                            {/* Details */}
                            <Text style={{ marginTop: '5px', fontSize: '12px' }}>Booked for</Text>
                            <Text style={{ fontSize: '11px', color: 'rgb(117 117 117)' }}>{moment(booking.checkIn).format("DD MMM YYYY")} - {moment(booking.checkOut).format("DD MMM YYYY")}</Text>
                            <Text style={{ fontSize: '11px', color: 'rgb(117 117 117)' }}>{Number(booking.guests.adults) + Number(booking.guests.childs)} Guests</Text>
                            {/* Address */}
                            <Text style={{ marginTop: '5px', fontSize: '12px' }}>Villa address</Text>
                            {booking.villa.googleMapsLink ?
                                <Link href={booking.villa.googleMapsLink} style={{ fontSize: '12px' }}>{booking.villa.address || 'Not available'}</Link> :
                                <Text style={{ fontSize: '11px' }}>{booking.villa.address || 'Not available'}</Text>
                            }
                        </View>
                        {/* Image */}
                        <Image src={booking.villa.images[0]} style={{ width: '300px', height: '120px', borderRadius: '5px', aspectRatio: '4/3' }} alt={booking.villa.name} className="aspect-[4/3] w-full xs:w-1/2 xs:h-auto md:w-1/3 md:h-auto lg:w-auto lg:h-full lg:max-w-[300px] bg-red-200 rounded-md"></Image >
                    </View>
                    {/* // Payment info */}
                    <View style={{ backgroundColor: 'white', display: 'column', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', paddingTop: '10px' }}>
                        {/* Details */}
                        <View style={{ width: '100%', flexDirection: 'column', display: 'flex' }}>
                            {/* Title */}
                            <Text style={{ fontSize: '14px', fontFamily: 'InterSemiBold' }}>Payment Details</Text>
                            <View style={{ gap: '10px', display: 'flex', flexDirection: 'column', fontSize: '11px', color: 'rgb(25 25 25)' }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '30px', justifyContent: 'space-between', fontSize: '11px', marginTop: '10px' }}>
                                    <View style={{ display: 'flex', gap: '5px' }}>
                                        <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>{booking.invoicePricing.totalNights} Night{Number(booking.invoicePricing.totalNights) > 1 ? 's' : ''} Price</Text>
                                        <Text style={{ color: 'rgb(117 117 117)', fontSize: '11px' }}>For {booking.guests.adults + booking.guests.childs} guest{booking.guests.adults + booking.guests.childs > 1 ? 's' : ''}</Text>
                                    </View>
                                    <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px', fontFamily: 'InterRegular' }}>{settings.website?.currencySymbol} {booking.invoicePricing.perNightPrice} X {booking.invoicePricing.totalNights}</Text>
                                </View>
                                {booking.invoicePricing.discount.totalPriceDiscount > 0 || booking.invoicePricing.discount.couponDiscount.couponCode &&
                                    <>
                                        <TitleDevider title='Discounts' />
                                        {booking.invoicePricing.discount.totalPriceDiscount > 0 && <View>
                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Price discount</Text>
                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px', fontFamily: 'InterRegular' }}>- {settings.website?.currencySymbol} {booking.invoicePricing.discount.totalPriceDiscount}</Text>
                                        </View>}
                                        {booking.invoicePricing.discount.couponDiscount.couponCode &&
                                            <View>
                                                <View className="flex flex-col">
                                                    <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Coupon discount</Text>
                                                    <Text style={{ color: 'rgb(117 117 117)', fontSize: '11px' }}>Code: {booking.invoicePricing.discount.couponDiscount.couponCode}</Text>
                                                </View>
                                                <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px', fontFamily: 'InterRegular' }}>- {settings.website?.currencySymbol} {booking.invoicePricing.discount.couponDiscount.price}</Text>
                                            </View>
                                        }
                                    </>
                                }
                                {booking.invoicePricing.taxes.appliedTaxes.length > 0 &&
                                    <>
                                        <TitleDevider title='Taxes' />
                                        {booking.invoicePricing.taxes.appliedTaxes.map((tax, index) => (
                                            <View key={index}>
                                                <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>{tax.name} ({tax.price}%)</Text>
                                                <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px', fontFamily: 'InterRegular' }}>{settings.website?.currencySymbol} {tax.appliedPrice}</Text>
                                            </View>
                                        ))}
                                    </>
                                }
                                {booking.invoicePricing.addons.appliedAddons.length > 0 &&
                                    <>
                                        <TitleDevider title='Addons' />
                                        {booking.invoicePricing.addons.appliedAddons.map((addon, index) => (
                                            <View key={index} style={{ justifyContent: 'space-between', alignContent: 'center', gap: '30px', display: 'flex', flexDirection: 'row' }}>
                                                <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>{addon.name}</Text>
                                                <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px', fontFamily: 'InterRegular' }}>{settings.website?.currencySymbol} {addon.price}</Text>
                                            </View>
                                        ))}
                                    </>
                                }
                                {(booking.invoicePricing.directDiscount && booking.invoicePricing.directDiscount > 0) &&
                                    <>
                                        <TitleDevider title='Direct discounts' />
                                        <View style={{ justifyContent: 'space-between', alignContent: 'center', gap: '30px', display: 'flex', flexDirection: 'row' }}>
                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Direct discount</Text>
                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px', fontFamily: 'InterRegular' }}>- {settings.website?.currencySymbol} {booking.invoicePricing.directDiscount}</Text>
                                        </View>
                                    </>
                                }
                                <TitleDevider title='Total' />
                                <View style={{ display: 'flex', flexDirection: 'row', gap: '30px', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Price to be paid</Text>
                                        <Text style={{ color: 'rgb(117 117 117)', fontSize: '11px', }}>For {booking.invoicePricing.totalNights} Night{Number(booking.invoicePricing.totalNights) > 1 ? 's' : ''} and {booking.guests.adults + booking.guests.childs} guest{booking.guests.adults + booking.guests.childs > 1 ? 's' : ''}</Text>
                                    </View>
                                    <Text style={{ color: 'black', fontSize: '14px', fontFamily: 'InterSemiBold' }}>{settings.website?.currencySymbol} {booking.invoicePricing.priceToBePaid.full}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: '30px', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Min. Price to be paid</Text>
                                    <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px', fontFamily: 'InterRegular' }}>{settings.website?.currencySymbol} {booking.invoicePricing.priceToBePaid.minimum}</Text>
                                </View>
                            </View>
                            {/* // Payments */}
                            <View style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                                <Text style={{ fontFamily: 'InterSemiBold', fontSize: '14px' }}>Payments made for this booking</Text>
                                <View style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '5px', padding: '5px' }}>
                                    <View>
                                        <View style={{ display: 'flex', flexDirection: 'row', gap: '30px', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Price Paid</Text>
                                            <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px', fontFamily: 'InterRegular' }}>{settings.website?.currencySymbol} {booking.totalPaidPrice}</Text>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', gap: '30px', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Remaining Price</Text>
                                            <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px', fontFamily: 'InterRegular' }}>{settings.website?.currencySymbol} {Number(booking.invoicePricing.priceToBePaid.full) - Number(booking.totalPaidPrice)}</Text>
                                        </View>
                                        {/* // Payments */}
                                        {booking.payments && booking.payments.length > 0 ?
                                            <View style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {booking.payments.map((payment, index) => (
                                                    <View key={index} style={{ display: 'flex', borderRadius: '5px', backgroundColor: 'gray', padding: '5px', flexDirection: 'column' }}>
                                                        <View >
                                                            <View style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'row' }}>
                                                                <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>{payment.src != 'other' ? payment.src.charAt(0).toUpperCase() + payment.src.slice(1) : payment.srcDesc} {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} payment</Text>
                                                                {payment.status == 'successful' && <Text style={{ color: 'green', fontSize: '11px' }}>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</Text>}
                                                                {payment.status == 'pending' && <Text style={{ color: 'orange', fontSize: '11px' }}>{payment.status.charAt(0).toUpperCase() + booking.status.slice(1)}</Text>}
                                                                {payment.status == 'cancelled' && <Text style={{ color: 'red', fontSize: '11px' }}>{payment.status.charAt(0).toUpperCase() + booking.status.slice(1)}</Text>}
                                                            </View>
                                                            {(payment.status == 'successful' && payment.src == 'razorpay' || payment.src == 'upi') && <View>
                                                                <Text style={{ fontSize: '12px', color: 'gray' }}>{payment.src == 'razorpay' ? 'Payment ID' : payment.src == 'upi' && 'Ref. No.'}</Text>
                                                                <Text style={{ fontSize: '12px', color: 'gray' }}>{payment.src == 'razorpay' ? payment.razorpay.paymentId : payment.src == 'upi' && payment.upi.refNo}</Text>
                                                            </View>}
                                                        </View>
                                                        <View style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
                                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Type</Text>
                                                            <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px' }}>{payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} payment</Text>
                                                        </View>
                                                        <View className="flex items-center gap-3 justify-between" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
                                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Price range</Text>
                                                            <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px' }}>{payment.range.charAt(0).toUpperCase() + payment.range.slice(1)} payment</Text>
                                                        </View>
                                                        <View className="flex items-center gap-3 justify-between" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
                                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Price</Text>
                                                            <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px', fontFamily: 'InterRegular' }}>{settings.website?.currencySymbol} {payment.price}</Text>
                                                        </View>
                                                        <View className="flex items-center gap-3 justify-between" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
                                                            <Text style={{ color: 'rgb(25 25 25)', fontSize: '12px' }}>Payment Date</Text>
                                                            <Text style={{ color: 'rgb(117 117 117)', fontSize: '12px' }}>{moment(payment.paymentDate).format("DD MMM YYYY")}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View> :
                                            <Text className='text-black-300 dark:text-black-200 text-base mt-2' style={{ color: 'rgb(117 117 117)', fontSize: '11px', marginTop: '10px' }}>No transactions for this booking found</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href={`tel:${settings.website?.info?.inquiryPhone}`} style={{ fontSize: '12px', color: 'blue' }}>Call Us {settings.website?.info?.inquiryPhone}</Link>
                    <Link href={websiteUrl} style={{ fontSize: '12px', color: 'blue' }}><Text>Visit {settings.website?.name} website</Text></Link>
                </View>
            </Page>
        </Document>
    )
}

export default Invoice