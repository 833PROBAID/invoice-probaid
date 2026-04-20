import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { get, ref } from "firebase/database";
import { database } from "../Shared/firebaseConfig";
import Loading from "../Shared/Loading";
import Seo from '../Components/SEO';

const ListingDetails = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const listingRef = ref(database, `listings/${id}`);
                const snapshot = await get(listingRef);
                if (snapshot.exists()) {
                    setListing({ id: snapshot.key, ...snapshot.val() });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Listing not found.",
                    });
                }
            } catch (error) {
                console.error("Error fetching Listing:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load Listing. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (!listing) {
        return <p className='text-center text-colorOrange'>Listing not found</p>;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Seo 
                title={`${listing?.address || 'Property'} Details`}
                description={`View details for ${listing?.address || 'this property'}`}
                pathname={`/listings/${id}`}
            />
            <div className='max-w-6xl mx-auto p-4 sm:p-6 md:p-8'>
                <Link
                    to='/listings'
                    className='inline-block mb-4 text-colorOrange text-xl font-semibold hover:underline'>
                    &larr; Back to Listings
                </Link>

                <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                    {/* Header Image with Overlay */}
                    <div
                        className='relative h-80 md:h-[50vh] lg:h-[60vh] bg-cover bg-center'
                        style={{
                            backgroundImage: `url(${listing.imageUrl})`,
                        }}>
                        <div className='absolute inset-0 bg-black opacity-40'></div>
                        <div className='absolute bottom-0 z-10 p-6 md:p-10 text-white w-full md:w-3/4 lg:w-1/2'>
                            <h1 className='text-2xl md:text-3xl font-bold'>
                                {listing.address}
                            </h1>
                            <div className='flex space-x-6 mt-4 text-lg'>
                                <div className='flex items-center space-x-2'>
                                    <i className='fas fa-bed'></i>
                                    <span>{listing.bedrooms}</span>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <i className='fas fa-bath'></i>
                                    <span>{listing.bathrooms}</span>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <i className='fas fa-home'></i>
                                    <span>{listing.squareFeet} sq ft</span>
                                </div>
                            </div>
                            <div className='flex items-center mt-4 space-x-2 text-lg'>
                                <i className='fas fa-map-marker-alt'></i>
                                <span>{listing.address}</span>
                            </div>
                            <div className='mt-6'>
                                <a
                                    href={listing.listingURL}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-block px-4 py-2 bg-colorTeal text-white font-semibold rounded shadow hover:bg-colorOrange transition duration-300'>
                                    See Listing
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className='p-8 lg:px-16 lg:py-12'>
                        <h2 className='text-2xl font-semibold text-colorTeal mb-4'>
                            Welcome to {listing.address}!
                        </h2>
                        <p className='text-gray-700 leading-relaxed whitespace-pre-line mb-8'>
                            {listing.description}
                        </p>
                        <h3 className='text-xl font-semibold text-colorTeal mb-4'>
                            Property Details:
                        </h3>
                        <ul className='list-disc list-inside space-y-2 text-gray-600'>
                            <li>
                                <strong>Address:</strong> {listing.address}
                            </li>
                            <li>
                                <strong>Property Type:</strong> {listing.propertyType}
                            </li>
                            <li>
                                <strong>Bedrooms:</strong> {listing.bedrooms}
                            </li>
                            <li>
                                <strong>Bathrooms:</strong> {listing.bathrooms}
                            </li>
                            <li>
                                <strong>Total Sq Ft:</strong> {listing.squareFeet}
                            </li>
                            <li>
                                <strong>Sold Price:</strong> {listing.soldPrice}
                            </li>
                            <li>
                                <strong>Sold Date:</strong> {listing.soldDate}
                            </li>
                        </ul>
                    </div>
                </div>

                <Link
                    to='/listings'
                    className='inline-block mt-4 text-colorOrange text-xl font-semibold hover:underline'>
                    &larr; Back to Listings
                </Link>
            </div>
        </>
    );
};

export default ListingDetails;
