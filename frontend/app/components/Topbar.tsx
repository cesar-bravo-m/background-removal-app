import FaqLink from "./FaqLink";
import GithubLink from "./GithubLink";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export default function Topbar() {
    return (
      <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 cursor-pointer">
            <div className="flex items-center gap-6 cursor-pointer">
              <FaqLink />
              <GithubLink />
            </div>
            <div className="flex items-center gap-2">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    )
}