import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 min-h-0">   {/* FIX */}
                {children}
            </main>
            <Footer />
        </div>
    );
}
