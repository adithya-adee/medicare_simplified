import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Medicare Simplified',
  description: 'Learn about Medicare Simplified, our mission, values, and the team behind our healthcare product platform.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Medicare Simplified</h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Making healthcare products accessible and affordable for everyone
        </p>
      </div>
      
      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Medicare Simplified was founded in 2020 with a clear mission: to simplify access to healthcare products and make them affordable for everyone. Born out of the frustration with complicated healthcare systems, our founders set out to create a platform that puts the customer first.
          </p>
          <p className="text-gray-600">
            What started as a small online store has grown into a comprehensive healthcare marketplace, serving thousands of customers nationwide. We partner with trusted manufacturers and healthcare providers to bring you quality products at competitive prices.
          </p>
        </div>
        <div className="relative h-80 rounded-lg overflow-hidden shadow-md">
          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-500 text-lg">Our Story Image</span>
          </div>
        </div>
      </div>
      
      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-600">
            To provide easy access to high-quality healthcare products and information, enabling people to take control of their health and well-being.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
          <p className="text-gray-600">
            A world where everyone has access to the healthcare products they need, without barriers of cost, complexity, or confusion.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-4">Our Values</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Customer-first approach</li>
            <li>• Quality and reliability</li>
            <li>• Transparency and honesty</li>
            <li>• Accessibility and inclusivity</li>
            <li>• Continuous improvement</li>
          </ul>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Dr. Sarah Johnson',
              role: 'Founder & CEO',
              bio: 'Former healthcare administrator with over 15 years of experience in healthcare product distribution.',
            },
            {
              name: 'Michael Chen',
              role: 'Chief Operations Officer',
              bio: 'Supply chain expert who ensures our products are delivered efficiently and sustainably.',
            },
            {
              name: 'Dr. Robert Williams',
              role: 'Medical Director',
              bio: 'Board-certified physician who oversees product selection and quality assurance.',
            },
            {
              name: 'Emily Patel',
              role: 'Customer Experience Director',
              bio: 'Passionate about creating seamless customer journeys and exceptional service.',
            },
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Photo</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="bg-blue-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">10,000+</p>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">5,000+</p>
            <p className="text-gray-600">Products Delivered</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">50+</p>
            <p className="text-gray-600">Healthcare Partners</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">24/7</p>
            <p className="text-gray-600">Customer Support</p>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'James Wilson',
              quote: 'Medicare Simplified has made it so much easier for me to get the medical supplies I need regularly. The subscription service is a game-changer!',
            },
            {
              name: 'Maria Rodriguez',
              quote: 'I appreciate the detailed product information and fast shipping. Their customer service team was also very helpful when I had questions.',
            },
            {
              name: 'Thomas Parker',
              quote: 'As someone who manages healthcare for an elderly parent, this service has saved me countless hours and reduced stress significantly.',
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
              <p className="font-medium">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA */}
      <div className="text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          We're on a mission to transform healthcare accessibility. Whether you're a customer, partner, or potential team member, we'd love to connect with you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/contact"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
          <Link 
            href="/products"
            className="bg-white text-blue-600 border border-blue-600 py-3 px-6 rounded-md hover:bg-blue-50 transition-colors"
          >
            Explore Our Products
          </Link>
        </div>
      </div>
    </div>
  );
} 