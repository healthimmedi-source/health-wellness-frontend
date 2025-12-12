import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="w-full">

      {/* HERO SECTION */}
      <div className="relative w-full h-[380px] rounded-xl overflow-hidden shadow-md mb-10">
        <img
          src="/homepage-clinic-hero3.jpg"   // put your image in public/ folder
          // OR use a URL:
          // src="https://images.unsplash.com/photo-1580281657521-67b13e03d75f?auto=format&fit=crop&w=1400&q=80"
          alt="Clinic and Doctors"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-6">
          <h1 className="text-4xl font-bold mb-3 drop-shadow-lg text-center">
            Your Health, Our Priority
          </h1>
          <p className="text-lg max-w-xl text-center mb-6 text-gray-200">
            Book appointments with trusted doctors and wellness specialists at our modern health center.
          </p>

          <Link
            to="/doctors"
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-lg transition"
          >
            Find a Doctor
          </Link>
        </div>
      </div>

      {/* SECONDARY SECTION */}
      <div className="text-center mt-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-3">
          Convenient Online Booking
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Browse doctors, view clinic details, and schedule appointments —
          all from the comfort of your home.
        </p>
      </div>

    </div>
  );
};

export default HomePage;
