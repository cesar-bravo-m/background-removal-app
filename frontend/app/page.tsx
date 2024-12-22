import CookieConsent from '@/app/components/CookieConsent'
import Topbar from "./components/Topbar";
import BottomBar from "./components/BottomBar";
import BackgroundRemover from "./components/BackgroundRemover";
import SelectedImageModal from "./components/SelectedImageModal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Topbar />
      <BackgroundRemover />
      <BottomBar />
      <SelectedImageModal />
      <CookieConsent language='en' />
    </div>
  );
}
