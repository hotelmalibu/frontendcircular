import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import IndexImagen from "../../components/home/IndexImagen";
import CardsSection from "../../components/home/CardsSection";
import ProjectsSection from "../../components/home/ProjectsSection";
import ImpactSection from "../../components/home/ImpactSection";
export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col">
      {/* If user exists, show a compact greeting */}
      {user && (
        <div className="w-full bg-gray-100 py-0">
          <div className="container mx-auto px-4 text-center">
            
          </div>
        </div>
      )}
      <IndexImagen />
      <CardsSection />
      <ImpactSection />
      <ProjectsSection />
    </div>
  );
}
