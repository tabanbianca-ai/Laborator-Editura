import { MagazineDigitalExperienceIssuePage } from "../../../components/pages/magazine-digital-experience-page";
import { getMagazineIssueExperienceData } from "../../../lib/magazine-experience-client";

interface MagazineIssueRouteProps {
  params: Promise<{
    issueId: string;
  }>;
}

export default async function MagazineIssueRoute({ params }: MagazineIssueRouteProps) {
  const { issueId } = await params;
  const data = await getMagazineIssueExperienceData({ issueId });

  return <MagazineDigitalExperienceIssuePage data={data} />;
}
