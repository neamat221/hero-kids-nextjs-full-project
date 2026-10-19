import Contact from "@/components/Contact/Contact";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Hero Kids. Questions about toys, products, or orders? Our friendly team is here to help.",
  path: "/contact",
});

const ContactPage = () => {
  return <Contact />;
};

export default ContactPage;
