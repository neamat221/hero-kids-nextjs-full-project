import { Poppins, Fredoka } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import { CartProvider } from "../components/Cart/CartContext";
import { WishlistProvider } from "../components/Wishlist/WishlistContext";
import AuthProvider from "../components/Auth/AuthProvider";
import localFont from "next/font/local";
import { siteUrl, siteName, ogImage } from "@/components/seo/meta";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

export const myFont = localFont({
  variable: "--font-mayaboti",
  src: [
    {
      path: "../../public/fonts/mayaboti-normal.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/mayaboti-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Hero Kids | Toys, Games & Kids Accessories",
    template: "%s | Hero Kids",
  },

  description:
    "Discover exciting toys, creative games, and educational products for kids at Hero Kids. Find the perfect toys to make every childhood moment special.",

  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "shopping",

  keywords: [
    "Hero Kids",
    "kids toys",
    "children toys",
    "educational toys",
    "baby toys",
    "kids games",
    "kids costumes",
    "STEM toys",
    "online toy shop",
    "toys in Bangladesh",
  ],

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/icon.svg" }],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "Hero Kids | Toys, Games & Kids Accessories",
    description:
      "Explore fun toys, creative games, and educational products for happy kids.",
    images: [ogImage],
  },

  twitter: {
    card: "summary_large_image",
    title: "Hero Kids | Toys, Games & Kids Accessories",
    description: "Discover fun toys and creative games for kids at Hero Kids.",
    images: [ogImage.url],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#ff6a3d",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Hero Kids",
      url: siteUrl,
      description:
        "Hero Kids is an online toy shop offering exciting toys, creative games, and educational products for children.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Hero Kids",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${fredoka.variable} ${myFont.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-base-100 text-base-content">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
