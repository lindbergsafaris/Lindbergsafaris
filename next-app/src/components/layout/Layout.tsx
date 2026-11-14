import Header from './Header';
import Footer from './Footer';
import FloatingSocials from '../ui/FloatingSocials';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <FloatingSocials />
        </div>
    );
};

export default Layout;
