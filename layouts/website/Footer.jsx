import React, { useContext } from 'react'
import { SettingsContext } from '@/conf/context/SettingsContext'
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const { settings } = useContext(SettingsContext);
  return (
    <>
      <footer className="bg-white mt-20 xs:mt-28">
        <div className="section-lg py-6">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Link href='/'><Image src={settings.website?.lightLogo} alt='Logo' height={50} width={200} className='basis-1 lg:basis-0 order-1 block max-h-12 w-auto max-w-full mr-10' /></Link>
              </div>
              <div className='mt-5 prose prose-base max-w-[500px] prose-headings:p-0 prose-headings:m-0 prose-p:m-0 space-y-[-5px]' dangerouslySetInnerHTML={{ __html: settings.website?.info?.footerPara }}></div>
              {/* <p className='text-base text-black-300 font-normal mt-5 max-w-[500px]'></p> */}
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-black-500 uppercase ">Quick Links</h2>
                <ul className="text-gray-600  font-medium">
                  <li className="mb-4">
                    <Link href="/" className="hover:text-black-500">Home</Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/explore" className="hover:text-black-500">Explore villas</Link>
                  </li>
                  <li>
                    <Link href="/about-us" className="hover:text-black-500">About us</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-black-500 uppercase ">Other Links</h2>
                <ul className="text-gray-600  font-medium">
                  <li className="mb-4">
                    <Link href="/privacy-policy" className="hover:text-black-500 ">Privacy Policy</Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/refund-policy" className="hover:text-black-500">Refund Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" className="hover:text-black-500">Terms & Conditions</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-black-500 uppercase ">Help & Support</h2>
                <ul className="text-gray-600  font-medium">
                  <li className="mb-4">
                    <Link href="/contact-us" className="hover:text-black-500">Contact us</Link>
                  </li>
                  <li>
                    <Link href={`tel:${settings.website?.info?.inquiryPhone}`} className="hover:text-black-500">Call us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-black-300 sm:text-center ">© {settings.website?.name}. Powered by <Link href={'https://www.tnitservices.com/'} target='_blank' className='font-medium text-blue-900'>TNIT</Link>
            </span>
            <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0 sm:items-center">
              {settings.website?.social?.facebook && <Link href={settings.website?.social.facebook} className="text-black-300 hover:text-black-500 ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                <span className="sr-only">Facebook page</span>
              </Link>}
              {settings.website?.social?.instagram && <Link href={settings.website?.social.instagram} className="text-black-300 hover:text-black-500 ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                <span className="sr-only">Instagram page</span>
              </Link>}
              {settings.website?.social?.x && <Link href={settings.website?.social.x} className="text-black-300 hover:text-black-500 ">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                <span className="sr-only">X page</span>
              </Link>}
              {settings.website?.social?.peerlist && <Link href={settings.website?.social.peerlist} className="text-black-300 hover:text-black-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 p-0.5" width={16} fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484-.08.08-.162.158-.242.234-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" /></svg>
                <span className="sr-only">Peerlist account</span>
              </Link>}
              {settings.website?.social?.linkedin && <Link href={settings.website?.social.linkedin} className="text-black-300 hover:text-black-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 p-0.5" width={16} fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>
                <span className="sr-only">Linkedin account</span>
              </Link>}
              {settings.website?.social?.youtube && <Link href={settings.website?.social.youtube} className="text-black-300 hover:text-black-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" /></svg>
                <span className="sr-only">Youtube account</span>
              </Link>}
              {settings.website?.social?.google && <Link href={settings.website?.social.google} className="text-black-300 hover:text-black-500 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 p-0.5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" /></svg>
                <span className="sr-only">Google account</span>
              </Link>}
            </div>
          </div>
        </div>
      </footer>
        {/* // Whatsapp icon >>>> */}
        {settings.website?.info.whatsappPhone &&
          <Link href={`https://wa.me/${settings.website?.info.whatsappPhone}`} target='_blank' passHref className="fixed bottom-16 lg:bottom-5 right-5 h-12 bg-green-600 rounded-md z-10 group flex gap-3 items-center p-2 cursor-pointer">
            <p className='hidden group-hover:block transition-all text-base text-white font-medium'>Chat on Whatsapp</p>
            <span className='w-8 block' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>whatsapp [#128]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -7599.000000)" fill="#ffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439" id="whatsapp-[#128]"> </path> </g> </g> </g> </g></svg>' }}></span>
          </Link>
        }
    </>
  )
}

export default Footer