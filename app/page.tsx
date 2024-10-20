import { Navrbar } from "@/components/component/navbar";
import { Sliders } from "@/components/component/sliders";
import { HotelSection } from "@/components/component/hotel-section";
import { ApartementSection } from "@/components/component/apartement-section";
import { CarSection } from "@/components/component/car-section";
import { SearchSection } from "@/components/component/search-section";

export default function Home() {
  return (
      <div>
        <Navrbar />
        <Sliders />
        <SearchSection />
        <HotelSection />
        <ApartementSection />
        <CarSection />
      </div>
  );
}



