import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#009048] via-[#00a855] to-[#009048] bg-center flex justify-center items-center py-[4rem] px-6 md:px-12">
      <div className="flex flex-col xl:flex-row justify-between items-center h-full text-white gap-[2rem] xl:gap-[5rem]">
        <div className="xl:min-w-1/2 flex flex-col items-center xl:items-start xl:pl-6 md:mt-[10rem] xl:mt-0 text-center xl:text-left">
          <p className="text-sm md:text-xl lg:text-3xl xl:text-xl mb-5 opacity-90 font-semibold">
            Begin your journey Towards Making People Healthy
          </p>
          <div className="flex justify-center items-center gap-4 mb-5">
            <Link 
              href="https://play.google.com/store/apps/details?id=com.wellnessz.nrr&hl=en_IN" 
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/playstore.png" 
                alt="Google Play Store" 
                width={120} 
                height={36} 
                className="cursor-pointer max-w-[120px] h-auto object-contain" 
              />
            </Link>
            <Link 
              href="https://apps.apple.com/in/app/nrr/id6753868656" 
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/appStore.png" 
                alt="Apple App Store" 
                width={120} 
                height={40} 
                className="cursor-pointer max-w-[120px] h-auto object-contain" 
              />
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center mr-2 md:mr-12">
          <Image
            src="/client-assets/swc_app_mockup.png"
            alt="SWC App Screens"
            width={900}
            height={900}
            className="w-full self-center lg:max-w-4xl xl:w-lg 2xl:max-w-3xl object-contain" 
          />
        </div>
      </div>
    </section>
  );
}