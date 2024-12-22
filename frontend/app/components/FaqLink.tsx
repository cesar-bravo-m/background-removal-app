import Link from "next/link";

export default function FaqLink() {
    return (
        <Link
            href='/faq-en'
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
            <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
            </svg>
            <span>FAQ</span>
        </Link>
    )
}