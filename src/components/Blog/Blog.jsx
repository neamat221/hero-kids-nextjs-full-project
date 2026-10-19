import React from "react";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import blogs from "@/data/blogs";

export const categoryStyles = {
  Education: { emoji: "🎓", gradient: "from-sky-400 to-indigo-500" },
  Parenting: { emoji: "🧸", gradient: "from-pink-400 to-rose-500" },
  "Child Development": { emoji: "🌱", gradient: "from-emerald-400 to-teal-500" },
  "Outdoor Activities": { emoji: "⚽", gradient: "from-amber-400 to-orange-500" },
  Learning: { emoji: "🧠", gradient: "from-violet-400 to-purple-500" },
  "Gift Guide": { emoji: "🎁", gradient: "from-fuchsia-400 to-pink-500" },
};

const getStyle = (category) =>
  categoryStyles[category] || {
    emoji: "📝",
    gradient: "from-primary to-secondary",
  };

const Cover = ({ blog, className = "", emojiClass = "text-6xl" }) => {
  const { emoji, gradient } = getStyle(blog.category);
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"
      />
      <span className={`${emojiClass} drop-shadow-lg transition-transform duration-500 group-hover:scale-110`}>
        {emoji}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        {blog.category}
      </span>
    </div>
  );
};

const Meta = ({ blog }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/60">
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
);

const Blog = () => {
  const [featured, ...rest] = blogs;

  return (
    <div className="space-y-8">
      {/* Featured */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group grid overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm transition-all hover:shadow-2xl md:grid-cols-2"
      >
        <Cover
          blog={featured}
          className="min-h-56 md:min-h-full"
          emojiClass="text-8xl"
        />
        <div className="space-y-4 p-6 md:p-10">
          <span className="badge badge-primary border-0 font-semibold text-primary-content">
            Featured
          </span>
          <h2 className="font-display text-2xl font-bold transition-colors group-hover:text-primary md:text-3xl">
            {featured.title}
          </h2>
          <p className="text-base-content/70">{featured.description}</p>
          <Meta blog={featured} />
          <span className="inline-flex items-center gap-2 font-semibold text-primary">
            Read article <FiArrowRight />
          </span>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group card overflow-hidden border border-base-200 bg-base-100 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <Cover blog={blog} className="h-40" emojiClass="text-5xl" />
            <div className="card-body gap-3">
              <h3 className="card-title text-base leading-snug transition-colors group-hover:text-primary">
                {blog.title}
              </h3>
              <p className="line-clamp-2 text-sm text-base-content/70">
                {blog.description}
              </p>
              <Meta blog={blog} />
              <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read more <FiArrowRight />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
