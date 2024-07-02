import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import AboutUsContent from "./aboutUsContent";
import TermsOfServiceContent from "./termsOfServiceContent";
import OnlineSecurityContent from "./onlineSecurityContent";
import PrivacyPolicyContent from "./privacyPolicyContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfo,
  faHandshake,
  faLock,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

const AboutUs = () => {
  const [selectedNavItem, setSelectedNavItem] = useState("About Us");

  const handleNavItemClick = (itemName, event) => {
    event.preventDefault();
    setSelectedNavItem(itemName);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (selectedNavItem) {
      case "About Us":
        return <AboutUsContent />;
      case "Terms of Service":
        return <TermsOfServiceContent />;
      case "Online security":
        return <OnlineSecurityContent />;
      case "Data privacy":
        return <PrivacyPolicyContent />;
      default:
        return null;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedNavItem]);

  return (
    <div className="main-settings-wrapper bg-gray-100 min-h-screen flex items-center justify-center pt-[0px]">
      <div className="flex flex-col md:flex-row w-full mx-auto bg-white  shadow-md overflow-hidden">
        <div className="md:w-1/4 p-8 bg-gray-800 text-white">
          <h2 className="text-2xl font-bold mb-4">Navigation</h2>
          <ul className="space-y-2">
            {[
              { name: "About Us", icon: faInfo },
              { name: "Terms of Service", icon: faHandshake },
              { name: "Online security", icon: faLock },
              { name: "Data privacy", icon: faShieldAlt },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={`flex items-center hover:text-blue-500 ${
                    selectedNavItem === item.name
                      ? "text-blue-600 font-semibold"
                      : ""
                  }`}
                  onClick={(event) => handleNavItemClick(item.name, event)}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-3/4 p-8">
          <Transition
            show={true}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {renderContent()}
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
