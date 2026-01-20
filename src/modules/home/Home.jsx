import IndexImagen from "../../components/home/IndexImagen";
import ProjectsSection from "../../components/home/ProjectsSection";
import FeaturedSection from "../../components/home/FeaturedSection";
import EventsSection from "../../components/home/EventsSection";
export default function Home() {


  return (
    <div className="flex flex-col">
      {/* If user exists, show a compact greeting */}

      <IndexImagen />
      <FeaturedSection />
      <ProjectsSection />
      <EventsSection />
    </div>
  );
}
