import Link from "next/link";
import { notFound } from "next/navigation";
import blogs from "@/data/blogs";
import { categoryStyles } from "@/components/Blog/Blog";
import { buildMetadata, siteUrl } from "@/components/seo/meta";
import {
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";

export function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  return buildMetadata({
    title: blog.title,
    description: blog.description,
    path: `/blog/${slug}`,
    type: "article",
    extraOpenGraph: {
      publishedTime: blog.date,
      authors: [blog.author],
      tags: blog.tags,
    },
  });
}

const BlogDetails = async ({ params }) => {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  const style = categoryStyles[blog.category] || {
    emoji: "📝",
    gradient: "from-primary to-secondary",
  };

  const paragraphs = blog.content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p !== "");

  const related = blogs.filter((b) => b.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.description,
        datePublished: blog.date,
        author: { "@type": "Person", name: blog.author },
        keywords: blog.tags.join(", "),
        publisher: { "@type": "Organization", name: "Hero Kids" },
        mainEntityOfPage: `${siteUrl}/blog/${slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: blog.title,
            item: `${siteUrl}/blog/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-base-content/60">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <FiChevronRight size={14} />
        <Link href="/blog" className="hover:text-primary">
          Blog
        </Link>
        <FiChevronRight size={14} />
        <span className="line-clamp-1 text-base-content">{blog.title}</span>
      </nav>

      <div
        className={`mb-8 flex h-56 items-center justify-center rounded-3xl bg-gradient-to-br ${style.gradient} md:h-64`}
      >
        <span className="text-8xl">{style.emoji}</span>
      </div>

      <span className="badge badge-primary border-0 font-semibold text-primary-content">
        {blog.category}
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
        {blog.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-base-200 pb-6 text-sm text-base-content/60">
        <span className="flex items-center gap-1">
          <FiUser /> {blog.author}
        </span>
        <span className="flex items-center gap-1">
          <FiCalendar /> {blog.date}
        </span>
        <span className="flex items-center gap-1">
          <FiClock /> {blog.readTime}
        </span>
      </div>

      <div className="mt-8 space-y-4 text-lg leading-relaxed text-base-content/80">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {blog.tags.map((tag) => (
          <span key={tag} className="badge badge-ghost">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/blog" className="btn btn-outline rounded-full gap-2">
          <FiArrowLeft /> Back to Blog
        </Link>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-bold">
            More Articles
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((b) => {
              const s = categoryStyles[b.category] || {
                emoji: "📝",
                gradient: "from-primary to-secondary",
              };
              return (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group overflow-hidden rounded-2xl border border-base-200 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`flex h-24 items-center justify-center bg-gradient-to-br ${s.gradient}`}
                  >
                    <span className="text-3xl">{s.emoji}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
};

export default BlogDetails;
