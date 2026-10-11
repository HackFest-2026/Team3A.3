import './globals.css';import type {Metadata} from 'next';
export const metadata:Metadata={title:'The Invisible Drag Detector',description:'AI operational command center for wind farm yaw misalignment'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
