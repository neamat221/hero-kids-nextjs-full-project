import Blog from "@/components/Blog/Blog";
import PageHero from "@/components/UI/PageHero";
import { buildMetadata } from "@/components/seo/meta";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Parenting tips, toy guides and child development insights from Hero Kids.",
  path: "/blog",
});

const BlogPage = () => {
  return (
    <div>
      <PageHero
        kicker="Insights"
        title="Our Blog"
        subtitle="Tips, ideas and inspiration to help your child learn and grow through play."
      />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <Blog />
      </div>
    </div>
  );
};

export default BlogPage;
