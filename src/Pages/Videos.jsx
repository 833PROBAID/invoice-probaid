import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../Shared/Loading";
import { ref, get } from "firebase/database";
import Swal from "sweetalert2";
import { database } from "../Shared/firebaseConfig";
import ReactPlayer from "react-player";
import Seo from '../Components/SEO';

const Videos = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const snapshot = await get(ref(database, "videos"));
            const data = snapshot.val();
            const loadedBlogs = [];
            for (const id in data) {
                loadedBlogs.push({ id, ...data[id] });
            }
            setBlogs(loadedBlogs);
        } catch (error) {
            console.error("Error fetching videos:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load videos. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Seo 
                title="Video Gallery"
                description="Watch our informative videos about probate real estate"
                pathname="/videos"
            />
            <div className='max-w-6xl mx-auto p-4 sm:p-6 md:p-8'>
                <h1 className='text-3xl font-bold text-colorTeal mb-8 text-center'>
                    Video Gallery
                </h1>

                <div className='grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className='bg-tealSoft bg-opacity-40 rounded-lg shadow-lg border border-tealSoft transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl'>
                            <div className='relative overflow-hidden rounded-t-lg'>
                                <ReactPlayer
                                    url={blog.link}
                                    width='100%'
                                    height='200px'
                                    className='rounded-t-lg object-cover'
                                />
                            </div>

                            <div className='p-3'>
                                <h2 className='text-lg text-center font-semibold text-colorOrange mb-3 transition-transform duration-300 hover:scale-105'>
                                    {blog.title}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Videos;
