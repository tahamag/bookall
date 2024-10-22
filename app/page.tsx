import { Navrbar } from "@/components/component/navbar";
import { Sliders } from "@/components/component/sliders";
import { HotelSection } from "@/components/component/hotel-section";
import { ApartmentSection } from "@/components/component/apartement-section";
import { CarSection } from "@/components/component/car-section";
import { SearchSection } from "@/components/component/search-section";
import Footer from "@/components/component/footer";

export default function Home() {
  return (
      <div>
        <Navrbar />
        <Sliders />
        <SearchSection />
        <HotelSection />
        <ApartmentSection />
        <CarSection />
        <Footer />
      </div>
  );
}



