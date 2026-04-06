import React from 'react';
import { GiWheat } from 'react-icons/gi';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-900 border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 8L8 0M-2 2L2 -2M6 10L10 6" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-md">
            <GiWheat className="text-5xl text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Empowering Farmers,<br />
            <span className="text-primary-400">Nourishing Communities</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
            EcomFarma bridges the gap between local farmers and consumers, creating a sustainable, transparent, and fair agricultural ecosystem.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We started with a simple vision: to make fresh, healthy food accessible to everyone while ensuring farmers get fair compensation for their hard work.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By cutting out the middlemen, we provide a direct line from the farm to your table. This means fresher produce for you, better margins for our farmers, and a lower carbon footprint for our planet.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium tracking-wide">Local Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10k+</div>
              <div className="text-gray-600 font-medium tracking-wide">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50k+</div>
              <div className="text-gray-600 font-medium tracking-wide">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium tracking-wide">Fresh Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Behind the Harvest</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=Team+Member+${i}&background=16a34a&color=fff&size=200`}
                    alt="Team Member"
                    className="rounded-full object-cover w-full h-full shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full ring-4 ring-primary-50 ring-offset-2"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Leader Name {i}</h3>
                <p className="text-primary-600 font-medium mb-3">Co-Founder</p>
                <p className="text-gray-500 text-sm">Passionate about agriculture and technology creating sustainable solutions.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
