const Sponsored = () => {
  const sponsors = [
    {
      name: "LG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg"
    },
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    }
  ];

  return (
    <div className="hidden sm:block bg-gray-900 to-pink-50 py-16 px-8 mb-12  shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-10 text-white">Our Trusted Partners</h2>
      <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg bg-white p-4 transition-all duration-300 ease-in-out hover:shadow-xl">
            <img
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-white font-semibold">{sponsor.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsored;

