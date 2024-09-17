import Moonimage from './assets/images/moon.svg';
import React, { useState, useEffect } from "react";
import './App.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const initialCountries = [
  { 
    id: 1, 
    name: "Germany", 
    capital: "Berlin", 
    population: 81770900, 
    region: "Europe", 
    flag: "https://flagcdn.com/de.svg" },
  { 
    id: 2, 
    name: "United States of America", 
    capital: "Washington, D.C.", 
    population: 323947000, 
    region: "Americas", 
    flag: "https://flagcdn.com/us.svg" },
  { 
    id: 3, 
    name: "Brazil", 
    capital: "Brasília", 
    population: 206135893, 
    region: "Americas", 
    flag: "https://flagcdn.com/br.svg" },
  { 
    id: 4, 
    name: "Iceland", 
    capital: "Reykjavik", 
    population: 334300, 
    region: "Europe", 
    flag: "https://flagcdn.com/is.svg" },
  { 
    id: 5, 
    name: "Afghanistan", 
    capital: "Kabul", 
    population: 27657145, 
    region: "Asia", 
    flag: "https://flagcdn.com/af.svg" },
  { 
    id: 6, 
    name: "Åland Islands", 
    capital: "Mariehamn", 
    population: 28875, 
    region: "Europe", 
    flag: "https://flagcdn.com/ax.svg" },
  { 
    id: 7, 
    name: "Albania", 
    capital: "Tirana", 
    population: 2886026, 
    region: "Europe", 
    flag: "https://flagcdn.com/al.svg" },
  { 
    id: 8, 
    name: "Algeria", 
    capital: "Algiers", 
    population: 40400000, 
    region: "Africa", flag: "https://flagcdn.com/dz.svg" }
];

const CountryCard = ({ country, onDelete, onUpdate }) => {
  const { name, capital, population, region, flag } = country;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 transform transition duration-500 ease-in-out hover:scale-105">
      <img className="w-full h-32 object-cover" src={flag} alt={`Flag of ${name}`} />
      <div className="mt-4">
        <h3 className="text-lg font-bold dark:text-white">{name}</h3>
        <p className="text-gray-700 dark:text-gray-400">Population: {population.toLocaleString()}</p>
        <p className="text-gray-700 dark:text-gray-400">Region: {region}</p>
        <p className="text-gray-700 dark:text-gray-400">Capital: {capital}</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => onUpdate(country)}
          >
            <i class="fa-solid fa-pen"></i>
          </button>
          <button
            className="px-3 py-2 bg-red-500 text-white rounded-lg"
            onClick={() => onDelete(country.id)}
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCountry, setNewCountry] = useState({ id: null, name: "", capital: "", population: "", region: "", flag: "", customRegion: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const savedCountries = JSON.parse(localStorage.getItem('countries')) || initialCountries;
    setCountries(savedCountries);
  }, []);

  useEffect(() => {
    localStorage.setItem('countries', JSON.stringify(countries));
  }, [countries]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const searchResults = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedRegion === "All" || country.region === selectedRegion)
      );
      setFilteredCountries(searchResults);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedRegion, countries]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setNewCountry({ ...newCountry, flag: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddCountry = () => {
    if (newCountry.name && newCountry.capital && newCountry.population && newCountry.flag) {
      const finalRegion = newCountry.region === "Other" ? newCountry.customRegion : newCountry.region;
      if (finalRegion) {
        const newCountryData = { ...newCountry, id: isEditing ? newCountry.id : countries.length + 1, population: parseInt(newCountry.population), region: finalRegion };

        if (isEditing) {
          const updatedCountries = countries.map(country => country.id === newCountryData.id ? newCountryData : country);
          setCountries(updatedCountries);
        } 
        else {
          setCountries([...countries, newCountryData]);
        }

        setIsModalOpen(false);
        resetCountryForm();
      } 
      else {
        alert("Please specify a region.");
      }
    } 
    else {
      alert("Please fill in all fields.");
    }
  };

  const handleDelete = (id) => {
    const updatedCountries = countries.filter(country => country.id !== id);
    setCountries(updatedCountries);
  };

  const handleUpdate = (country) => {
    setNewCountry(country);
    setImagePreview(country.flag);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetCountryForm = () => {
    setNewCountry({ id: null, name: "", capital: "", population: "", region: "", flag: "", customRegion: "" });
    setImagePreview("");
    setIsEditing(false);
  };

  const closeModal = (e) => {
    if (e.target.id === 'modal-container') {
      setIsModalOpen(false);
      resetCountryForm();
    }
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 min-h-screen`}>
      <div className={`container mx-auto px-6 py-8 ${isModalOpen ? 'blur-md' : ''}`}>
         {/*Carousel */}
         <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="relative">
            <img src="https://flagcdn.com/de.svg" alt="Slide 1" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">Germany</h3>
            </div>
          </div>
        </SwiperSlide>
        
        <SwiperSlide>
          <div className="relative">
          <img src="https://flagcdn.com/us.svg" alt="Slide 1" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">United States of America</h3>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img src="https://flagcdn.com/br.svg" alt="Slide 3" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">Brazil</h3>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img src="https://flagcdn.com/is.svg" alt="Slide 4" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">Iceland</h3>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img src="https://flagcdn.com/af.svg" alt="Slide 5" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">Afghanistan</h3>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img src="https://flagcdn.com/ax.svg" alt="Slide 6" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">Åland Islands</h3>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img src="https://flagcdn.com/al.svg" alt="Slide 7" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">Albania</h3>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img src="https://flagcdn.com/dz.svg" alt="Slide 8" className="w-full h-64 object-contain" />
            <div className="absolute inset-0 bg-slate-500 bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl">Algeria</h3>
            </div>
          </div>
        </SwiperSlide>
          </Swiper>
        {/* Header */}
        <header className="flex justify-between items-center mb-8 mt-8">
          <h1 className="text-3xl font-bold dark:text-white">Where in the world?</h1>
          <div className="flex items-center">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false);
              }}
              className="mr-4 flex items-center bg-green-500 text-white rounded-full px-4 py-2 shadow-md"
            >
              Add Country
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full px-4 py-2 shadow-md"
            >
              <img src={Moonimage} alt="Moon Icon" className="w-5 h-5 mr-2" /> 
              Dark Mode
            </button>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white"
          />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-1/6 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white font-bold"
          >
            <option value="All">All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCountries.map(country => (
              <CountryCard key={country.id} country={country} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-container"
          onClick={closeModal}
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl text-center font-bold mb-4 dark:text-white">{isEditing ? "Update Country" : "Add Country"}</h2>
            <input
              type="text"
              value={newCountry.name}
              onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              placeholder="Country Name"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              value={newCountry.capital}
              onChange={(e) => setNewCountry({ ...newCountry, capital: e.target.value })}
              placeholder="Capital"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white"
            />
            <input
              type="number"
              value={newCountry.population}
              onChange={(e) => setNewCountry({ ...newCountry, population: e.target.value })}
              placeholder="Population"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white"
            />
            <select
              value={newCountry.region}
              onChange={(e) => setNewCountry({ ...newCountry, region: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select a region</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
              <option value="Other">Other</option>
            </select>
            {newCountry.region === "Other" && (
              <input
                type="text"
                value={newCountry.customRegion}
                onChange={(e) => setNewCountry({ ...newCountry, customRegion: e.target.value })}
                placeholder="Custom Region"
                className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white"
              />
            )}
            <input type="file" onChange={handleImageUpload} className="mb-4" />
            {imagePreview && (
              <img src={imagePreview} alt="Flag Preview" className="w-full h-32 object-cover mb-4" />
            )}
            <div className="flex justify-end">
              <button
                onClick={handleAddCountry}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {isEditing ? "Save Changes" : "Add Country"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
