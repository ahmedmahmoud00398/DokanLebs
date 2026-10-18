import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
export const metadata = {
    title: 'Dokan Lebss — Everyday essentials',
    description: 'Dokan Lebss clothing and everyday essentials.',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
        apple: '/apple-icon.png',
    },
};
export const viewport = {
    colorScheme: 'light dark',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsxs("body", { className: "antialiased", children: [children, process.env.NODE_ENV === 'production' && _jsx(Analytics, {})] }) }));
}
