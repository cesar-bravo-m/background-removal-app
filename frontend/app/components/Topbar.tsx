'use client'
import { useState, useEffect } from 'react';
import FaqLink from "./FaqLink";
import GithubLink from "./GithubLink";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function Topbar() {
    const [useClerk, setUseClerk] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setUseClerk(process.env.NEXT_PUBLIC_USE_CLERK === 'true');
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-6">
                            <FaqLink />
                            <GithubLink />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (useClerk) {
        return (
            <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-6">
                            <FaqLink />
                            <GithubLink />
                        </div>
                        <div className="flex items-center gap-2">
                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-10 h-10"
                                        }
                                    }}
                                />
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="px-4 py-2.5 text-base font-medium rounded-lg 
                                                     bg-blue-600 text-white hover:bg-blue-500 
                                                     transition-colors">
                                        Sign in
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-6">
                        <FaqLink />
                        <GithubLink />
                    </div>
                </div>
            </div>
        </div>
    );
}