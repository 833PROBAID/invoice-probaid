import { Helmet } from "react-helmet-async";

const Seo = ({ title, description, image, type = "website", pathname }) => {
	const siteUrl = window.location.origin;
	const defaultDescription = "833Probate - Professional Probate Services";
	const defaultImage = "/banner.png";

	const seo = {
		title: title ? `${title} | 833Probate` : "833Probate",
		description: description || defaultDescription,
		image: `${siteUrl}${image || defaultImage}`,
		url: `${siteUrl}${pathname || ""}`,
	};

	return (
		<Helmet>
			<title>{seo.title}</title>
			<meta name='description' content={seo.description} />
			<meta name='image' content={seo.image} />

			{/* Open Graph */}
			<meta property='og:title' content={seo.title} />
			<meta property='og:description' content={seo.description} />
			<meta property='og:image' content={seo.image} />
			<meta property='og:url' content={seo.url} />
			<meta property='og:type' content={type} />

			{/* Twitter */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={seo.title} />
			<meta name='twitter:description' content={seo.description} />
			<meta name='twitter:image' content={seo.image} />
		</Helmet>
	);
};

export default Seo;
