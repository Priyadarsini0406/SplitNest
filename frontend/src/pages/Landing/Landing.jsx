import SplitNestNavbar from "../../components/Navbar/Navbar";
import SplitNestHero from "../../components/Hero/Hero";
import SplitNestFeatures from "../../components/Features/Features";
import SplitNestStatistics from "../../components/Statistics/Statistics";
import SplitNestHowItWorks from "../../components/HowItWorks/HowItWorks";
import SplitNestPropertyShowcase from "../../components/PropertyShowcase/PropertyShowcase";
import SplitNestWhyChoose from "../../components/WhyChoose/WhyChoose";
import SplitNestTestimonials from "../../components/Testimonials/Testimonials";
import SplitNestFAQ from "../../components/FAQ/FAQ";
import About from "../../components/About/About";
import Contact from "../../components/Contact/Contact";
import SplitNestCTA from "../../components/CTA/CTA";
import SplitNestFooter from "../../components/Footer/Footer";

function Landing() {
    return (
        <>
            <SplitNestNavbar />
            <SplitNestHero />
            <SplitNestFeatures />
            <SplitNestStatistics />
            <SplitNestHowItWorks />
            <SplitNestPropertyShowcase />
            <SplitNestWhyChoose />
            <SplitNestTestimonials />
            <SplitNestFAQ />
            <About />
            <Contact />
            <SplitNestCTA />
            <SplitNestFooter />
        </>
    );
}

export default Landing;
