import React from "react";
import { AcmeLogo } from "./AcmeLogo";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";

const CustomFooter = () => {
  return (
    <footer className="bg-slate-200 text-black   p-6">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo i Naziv */}
        <div className="flex items-center mb-4 md:mb-0 ml-300 md:ml-0">
          <AcmeLogo />
          <p className="font-bold ml-2">MAJSTOR.BA</p>
        </div>

        {/* Srednji Sadržaj */}
        <div className="mb-4 md:mb-0">
          <p>
            A platform specialized for finding and advertising craftsmen in
            Bosnia and Herzegovina. Find or offer services, quickly and easily!
          </p>
        </div>

        {/* Društvene Mreže */}
        <div className="flex justify-center mb-4 md:mb-0">
          <a
            href="https://www.facebook.com/majstor.ba"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2"
          >
            <FaTiktok />
          </a>
        </div>
      </div>

      {/* Donji Dio */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center mb-4 md:mb-0">
            <a href="aboutUs" className="mx-2">
              Privacy policy
            </a>
            <a href="aboutUs" className="mx-2">
              Terms of use
            </a>
            <a href="aboutUs" className="mx-2">
              Safety on the Internet
            </a>
          </div>
          <div className="flex flex-wrap justify-center">
            <a href="aboutUs " className="mx-2">
              Contact Us
            </a>
            <a href="aboutUs" className="mx-2">
              About Us
            </a>
          </div>
        </div>
        <p className="text-center mt-4">
          © 2024 Majstor.ba All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default CustomFooter;
