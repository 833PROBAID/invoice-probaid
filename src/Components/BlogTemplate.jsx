import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const BlogTemplate = ({ blogData }) => {
  return (
    <>
      <Helmet>
        <title>{blogData.title} | 833PROBAID</title>
        <meta name="description" content={blogData.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Image with Orange Border */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-8 border-orange-500 mb-8">
            <img 
              src={blogData.headerImage} 
              alt={blogData.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Title Section */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-6 rounded-t-lg">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {blogData.title}
            </h1>
          </div>

          {/* Subtitle/Introduction */}
          {blogData.subtitle && (
            <div className="bg-white px-8 py-6 border-l-4 border-teal-500 shadow-md">
              <p className="text-lg text-gray-700 leading-relaxed">
                {blogData.subtitle}
              </p>
            </div>
          )}

          {/* Main Content Sections */}
          <div className="bg-white rounded-b-lg shadow-lg">
            {blogData.sections.map((section, index) => (
              <div 
                key={index} 
                className={`px-8 py-8 ${index !== blogData.sections.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                {/* Section Number and Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                      {section.heading}
                    </h2>
                  </div>
                </div>

                {/* Section Content */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Text Content */}
                  <div className="space-y-4">
                    {section.introduction && (
                      <p className="text-gray-700 leading-relaxed">
                        {section.introduction}
                      </p>
                    )}

                    {/* Bullet Points or Sub-sections */}
                    {section.points && section.points.length > 0 && (
                      <div className="space-y-4">
                        {section.points.map((point, pointIndex) => (
                          <div key={pointIndex} className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-400">
                            <h3 className="font-bold text-gray-800 mb-2 flex items-start gap-2">
                              <span className="text-orange-500">•</span>
                              <span>{point.title}</span>
                            </h3>
                            <p className="text-gray-600 text-sm ml-4 leading-relaxed">
                              {point.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Additional Content */}
                    {section.content && (
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {section.content}
                      </div>
                    )}

                    {/* Pro Tip or Special Note */}
                    {section.proTip && (
                      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-teal-400 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold text-sm">💡 Pro Tip:</span>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {section.proTip}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section Image */}
                  {section.image && (
                    <div className="flex items-center justify-center">
                      <img 
                        src={section.image} 
                        alt={section.heading}
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Conclusion Section */}
          {blogData.conclusion && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-400 rounded-lg p-8 mt-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-orange-500">💭</span>
                Concluding Thoughts
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {blogData.conclusion}
              </p>
            </div>
          )}

          {/* Call to Action */}
          {blogData.cta && (
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg p-8 mt-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">{blogData.cta.title}</h3>
              <p className="text-lg mb-6">{blogData.cta.description}</p>
              {blogData.cta.buttonText && (
                <a 
                  href={blogData.cta.buttonLink || '/contact-us'}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                >
                  {blogData.cta.buttonText}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

BlogTemplate.propTypes = {
  blogData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    headerImage: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        heading: PropTypes.string.isRequired,
        introduction: PropTypes.string,
        points: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
          })
        ),
        content: PropTypes.string,
        proTip: PropTypes.string,
        image: PropTypes.string,
      })
    ).isRequired,
    conclusion: PropTypes.string,
    cta: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      buttonText: PropTypes.string,
      buttonLink: PropTypes.string,
    }),
  }).isRequired,
};

export default BlogTemplate;
