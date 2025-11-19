// import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { directionMap } from "../constants/_website/Global";
import ReduxProvider from "../_components/_global/_client/ReduxProvider";
import ClientLayout from "../_components/_global/_client/ClientLayout";
import Navbar from "../_components/_global/Navbar";
import Footer from "../_components/_global/Footer";
import { getSharedMetadata } from "../_helpers/SharedMetadata";
import ScrollToTop from "../_components/_global/ScrollToTop";
import ThemeProvider from "../_components/_website/ThemeProvider";
import FetchData from "../_helpers/FetchData";
import { getServerTranslation } from "../_helpers/serverTranslation";

export async function generateMetadata() {
  const t = await getServerTranslation("ar", "mainMeta");
  const sharedMetadata = await getSharedMetadata(t.title, t.description);

  return {
    title: t.title,
    description: t.description,
    ...sharedMetadata,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  const socialData = await FetchData(`/social-contact-info`, false);
  return (
    <html dir={directionMap[locale as "en" | "ar"]} lang={locale}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Cairo:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Favicons */}
        <link rel="icon" href="/logo.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/logo-square.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/logo-square.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Structured Data for Google (Organization Logo) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: "https://dcpc.org.sy",
              logo: "https://dcpc.org.sy/logo-square.png", // الشعار المربع الجديد (256x256)
              name: "Dialogue and Civil Peace Center",
              sameAs: [
                "https://www.facebook.com/Dialogue-and-Civil-Peace-Center",
                "https://twitter.com/Dialogue-and-Civil-Peace-Center",
                "https://www.linkedin.com/company/Dialogue-and-Civil-Peace-Center",
              ],
            }),
          }}
        />
      </head>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider>
            <ClientLayout>
              <Toaster position="top-center" richColors closeButton />
              <Navbar socialData={socialData} />
              <div className="w-full min-h-screen relative">
                {children}
                <ScrollToTop />
              </div>
              <Footer socialData={socialData} />
            </ClientLayout>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
