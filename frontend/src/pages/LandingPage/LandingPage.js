import style from './landingPage.module.css';
import AuroraBlob from '../../components/AuroraBlob/AuroraBlob';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from './HeroSection';
import FeaturesCard from './FeaturesCard';
import CtaSection from './CtaSection';
import { featuresInfo, howItWorksInfo } from './landingPageData';

const LandingPage = () => {

    return (
        <>
           <div className={style.mainWrapper}>
            <AuroraBlob />
            <Header />
            <main>
                <HeroSection />
                <FeaturesCard id="features" title="Tính Năng Nổi Bật" featureCardInfo={featuresInfo} />
                <FeaturesCard id="how-it-works" title="Bắt đầu chỉ với 3 bước đơn giản" featureCardInfo={howItWorksInfo} />
                <CtaSection />
            </main>
            <Footer />
           </div>
        </>
    )
};

export default LandingPage;
