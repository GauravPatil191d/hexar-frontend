import BannerContainer from "@/containers/banner-container";
import RibbonContainer from "@/containers/ribbon-container";
import AboutUsContainer from "@/containers/about-us-container";
import MissionVisionContainer from "@/containers/mission-vision-container";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-black">
      <BannerContainer />
      <RibbonContainer />
      <AboutUsContainer />
      <MissionVisionContainer />
    </main>
  );
}
