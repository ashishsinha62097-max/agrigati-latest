// Re-export the landing page content from the original App.tsx
// This file just renders the landing page as a route component
import LandingPageContent from "../LandingPageContent";

export default function LandingPage() {
  return <LandingPageContent />;
}
