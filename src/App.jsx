import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaEye, FaEyeSlash, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";

import "leaflet/dist/leaflet.css";

function App() {
  document.title = "UrInformation"
  const [ipData, setIpData] = useState(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    userAgent: '',
    platform: '',
    cores: '',
    memory: '',
    screenResolution: '',
  });

  useEffect(() => {
    axios.get("https://ipapi.co/json/")
      .then((response) => {
        setIpData({
          ip: response.data.ip,
          country: response.data.country_name,
          countryCode: response.data.country_code,
          region: response.data.region,
          city: response.data.city,
          postal: response.data.postal,
          timezone: response.data.timezone,
          utcOffset: response.data.utc_offset,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
        });
      })
      .catch((error) => {
        console.error("Error fetching IP data:", error);
      });

    const memory = navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Unknown';
    const cores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency + ' cores' : 'Unknown';
    const resolution = `${window.screen.width} x ${window.screen.height}`;

    setSystemInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      cores: cores,
      memory: memory,
      screenResolution: resolution,
    });
  }, []);

  const toggleHide = () => {
    setIsHidden(!isHidden);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const customMarker = new L.Icon({
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "https://www.svgrepo.com/show/106426/location-pin.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        {isDarkMode ? (
          <>
            <BsSun className="text-yellow-400" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <BsMoon className="text-blue-600" />
            <span>Dark Mode</span>
          </>
        )}
      </button>

      <div className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-xl mt-16">
        <h1 className="text-2xl font-bold mb-4">Your System and IP Information</h1>

        {ipData ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">IP Address:</span>
              <span className={`text-lg ${isHidden ? "blur-sm" : ""}`}>
                {isHidden ? "XXX.XXX.XXX.XXX" : ipData.ip}
              </span>
              <button
                onClick={toggleHide}
                className="flex items-center justify-center px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition ml-4 shadow-md hover:shadow-lg"
              >
                {isHidden ? (
                  <>
                    <FaEye className="mr-2" />
                    Show IP
                  </>
                ) : (
                  <>
                    <FaEyeSlash className="mr-2" />
                    Hide IP
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="text-blue-500 mr-2" />
              <span className="text-lg font-semibold">Location:</span>
              <span className="text-lg ml-2">{ipData.city}, {ipData.region}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaRegClock className="text-blue-500 mr-2" />
              <span className="text-lg font-semibold">Timezone:</span>
              <span className="text-lg ml-2">{ipData.timezone} (UTC {ipData.utcOffset})</span>
            </div>
          </div>
        ) : (
          <p>Loading IP data...</p>
        )}

        {ipData && (
          <div className="mt-6">
            <MapContainer
              center={[ipData.latitude, ipData.longitude]}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-72 rounded-lg shadow-lg mb-6"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[ipData.latitude, ipData.longitude]} icon={customMarker}>
                <Popup>
                  {ipData.city}, {ipData.region}, {ipData.country}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">System Information</h2>
        <div className="mb-2">
          <span className="text-lg font-semibold">User Agent:</span>
          <span className="text-lg">{systemInfo.userAgent}</span>
        </div>
        <div className="mb-2">
          <span className="text-lg font-semibold">Platform:</span>
          <span className="text-lg">{systemInfo.platform}</span>
        </div>
        <div className="mb-2">
          <span className="text-lg font-semibold">CPU Cores:</span>
          <span className="text-lg">{systemInfo.cores}</span>
        </div>
        <div className="mb-2">
          <span className="text-lg font-semibold">Memory:</span>
          <span className="text-lg">{systemInfo.memory}</span>
        </div>
        <div className="mb-2">
          <span className="text-lg font-semibold">Screen Resolution:</span>
          <span className="text-lg">{systemInfo.screenResolution}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
