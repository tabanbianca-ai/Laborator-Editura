import { MagazineDigitalExperienceIndexPage } from "../../components/pages/magazine-digital-experience-page";
import { getMagazineExperienceIndexData } from "../../lib/magazine-experience-client";

export default async function MagazineRoute() {
  const data = await getMagazineExperienceIndexData();

  return <MagazineDigitalExperienceIndexPage data={data} />;
}
