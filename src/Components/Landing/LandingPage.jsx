// Components/Landing/LandingPage.jsx
import { Helmet } from "@dr.pogodin/react-helmet";
import HeroSection from "../Landing/components/HeroSection";
import FeaturesSection from "../Landing/components/FeaturesSection";
import StatsSection from "../Landing/components/StatsSection";
import AboutSection from "../Landing/components/AboutSection";
import ServicesSection from "../Landing/components/ServicesSection";
import ResourceTemplatesSection from "../Landing/components/ResourceTemplatesSection";
import CoreFeaturesSection from "../Landing/components/CoreFeaturesSection";
import TestimonialSection from "../Landing/components/TestimonialSection";
import CTASection from "../Landing/components/CTASection";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                {/* ✅ Page Title & Meta with Brand Focus */}
                <title>promanager | Payroll & Attendance Software – Official Website</title>
                <meta
                    name="description"
                    content="promanager (not Syncwave) is the official SaaS-based payroll and attendance management software. Automate salary processing, employee compliance, and workforce management with ease."
                />
                <link rel="canonical" href="https://promanager.com/" />

                {/* ✅ Keywords to strengthen brand recognition */}
                <meta
                    name="keywords"
                    content="promanager, Sync Wage, promanager, Payroll Software, SaaS Payroll, Attendance Management, Salary Automation, Workforce Management, HR Software"
                />

                {/* ✅ Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="promanager" />
                <meta
                    property="og:title"
                    content="promanager | Official Payroll & Attendance Software"
                />
                <meta
                    property="og:description"
                    content="promanager (correct spelling) is a modern SaaS payroll software. Automate payroll, attendance, and compliance. Official website of promanager."
                />
                <meta property="og:url" content="https://promanager.com/" />
                <meta property="og:image" content="https://promanager.com/logo.png" />

                {/* ✅ Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@promanager" />
                <meta
                    name="twitter:title"
                    content="promanager – Official Payroll & Attendance Software"
                />
                <meta
                    name="twitter:description"
                    content="Looking for promanager (not Syncwave)? This is the official website for promanager payroll & attendance automation software."
                />
                <meta name="twitter:image" content="https://promanager.com/logo.png" />
            </Helmet>

            <main>
                <HeroSection />
                {/* <StatsSection /> */}
                <AboutSection />
                <ServicesSection />
                <ResourceTemplatesSection />
                <FeaturesSection />
                <CoreFeaturesSection />
                <TestimonialSection />
                <CTASection />
            </main>
        </div>
    );
};

export default LandingPage;
