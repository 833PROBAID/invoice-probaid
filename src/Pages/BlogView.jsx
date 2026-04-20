import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../Shared/Loading";
import Swal from "sweetalert2";
import { database } from "../Shared/firebaseConfig";
import { get, ref } from "firebase/database";
import Seo from "../Components/SEO";

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blogRef = ref(database, `blogsDev/${id}`);
        const snapshot = await get(blogRef);

        if (snapshot.exists()) {
          const blogData = snapshot.val();
          if (blogData.status === "published") {
            setBlog({ id: snapshot.key, ...blogData });
          } else {
            setBlog(null);
          }
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load blog. Please try again later.",
        });
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <>
        <Seo title="Blog Not Found" />
        <div className="flex flex-col justify-center items-center min-h-screen px-4 text-center">
          <div className="mb-4 text-7xl text-colorTeal">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-colorTeal mb-4">
            Blog Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md">
            The blog you're looking for doesn't exist or is currently
            unavailable.
          </p>
          <Link
            to="/blogs"
            className="px-6 py-3 bg-colorTeal text-white rounded-lg hover:bg-colorOrange transition-colors font-medium flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Browse All Blogs
          </Link>
        </div>
      </>
    );
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Seo
        title={blog.title}
        description={blog.summary?.substring(0, 160)}
        image={blog.imageUrl || "/blog_default.jpg"}
        type="article"
        pathname={`/blog/${id}`}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-10">
        <Link
          to="/blogs"
          className="inline-block mb-4 sm:mb-6 text-colorOrange text-lg sm:text-2xl font-semibold hover:underline transition-colors"
        >
          &larr; Back to Blogs
        </Link>
        <div dangerouslySetInnerHTML={{ __html: blog.summary }} />
        <Link
          to="/blogs"
          className="inline-block mt-4 sm:mt-6 text-colorOrange text-lg sm:text-2xl font-semibold hover:underline transition-colors"
        >
          &larr; Back to Blogs
        </Link>
      </div>
    </>
  );
};

export default BlogView;
