import React, { useState } from "react";
import axios from "axios";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Input, Textarea, Button } from "@nextui-org/react";
import { Toaster, toast } from "sonner";

const AboutUsContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("All fields are required", {
        duration: 3000,
      });
      return;
    }
    const loadingToastId = toast.loading("Sending email");
    axios
      .post("http://localhost:8080/contact", {
        name,
        email,
        phone_number: phoneNumber,
        message,
      })
      .then((response) => {
        console.log("Email sent successfully", response);
        toast.success("Email sent successfully!", {
          duration: 3000,
        });
        toast.dismiss(loadingToastId);
        setName("");
        setEmail("");
        setPhoneNumber("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending email", error);
      });
  };
  return (
    <div className="about-us-container">
      <Toaster richColors position="top-right" />
      <div className="hero-section text-center bg-gray-100 p-10">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Majstor.ba - Your place for quality services
        </h1>
        <p className="text-xl mb-6">
          We connect you with the best craftsmen for all your needs.
        </p>
      </div>

      {/* Introduction Section */}
      <div className="about-us-card bg-white shadow-md rounded-lg p-8 mb-10 text-justify">
        <p className="text-lg">
          Majstor.ba proudly stands out as your indispensable travel partner
          finding skilled craftsmen for all your needs. With more than ten years
          of rich experience, our platform has become synonymous with quality,
          reliability and uncompromising service. Every master at ours platform
          has been carefully selected and checked to ensure you the ultimate
          experience. Whether it's home repairs or renovations of space, or any
          other master project, is Majstor.ba a place where your needs become a
          priority. Our advantage lies in efficiency and practicality. With a
          wide range of qualifications and expertise of our masters, we provide
          you with access to top services professionals with just a few clicks.
          Regardless of the type of work or scope of the project, our platform
          is designed to meet yours specific requirements. With Majstor.ba, you
          not only get access skilled craftsmen, but also the assurance of
          flawless service that is the result of our many years of experience.
          Your satisfaction is ours the biggest prize, and we proudly continue
          to provide top-notch support to users throughout the region. Let us
          ease your way to of the best craftsmen, because our mission is to
          realize your projects with with ease and trust.
        </p>
      </div>

      {/* Our Mission Section */}
      <div className="about-us-card bg-white shadow-md rounded-lg p-8 mb-10 text-justify">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg">
          Our passionate mission at Majstor.ba is to transform your ideas into
          reality, facilitating your path to reliable and qualified craftsmen.
          With dedication, we work to provide a simple and efficient way to you
          would find experts who will turn your ideas into reality. We want to
          become the key link between you and the ideal craftsman for all your
          needs projects, regardless of their size or complexity. Our goal is
          not to not only to offer a platform to connect, but to create a
          community that provides you with security, support and the best
          experts in the industry. Beige regardless of whether you are looking
          for a master for home repairs, space renovation or any other project,
          our mission is to provide you simply experience, realizing your ideas
          with the help of experts who share yours vision. At the heart of our
          mission lies the belief that cooperation with qualified it should be
          easy, safe and inspiring for masters. We strive to create a space
          where your needs meet high quality standards, giving you the
          confidence to accomplish your projects with reliable partners on the
          way to success. We are here to support you in each step by step,
          because your success is also our success.
        </p>
      </div>

      {/* Additional Information */}
      <div className="additional-info bg-gray-100 p-10 rounded-lg text-justify">
        <h2 className="text-3xl font-bold mb-6">Additional Information</h2>
        <ul className="list-disc list-inside text-lg space-y-2">
          <li>
            Find a craftsmen for various professions, from simple repairs to
            complex projects.
          </li>
          <li>
            Rate and review the masters after the work is completed, helping
            community to make informed decisions.
          </li>
          <li>
            Our customer support is available 24/7, ready to help you in every
            moment.
          </li>
        </ul>
        {/* Email  */}
        <div className="email-form bg-white shadow-md rounded-lg text-center p-8 mt-12">
          <h2 className="text-3xl font-bold mb-4">Send us a message</h2>
          <form onSubmit={sendEmail}>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                className="w-full"
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full"
              />
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="3876xxxxxxx"
                className="w-full"
              />
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                required
                className="w-full"
              />

              <Button
                type="submit"
                className="submit-button w-full bg-gray-800 text-white"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* Contact Information */}
      <div className="contact-section bg-white shadow-md rounded-lg text-center p-8 mt-12">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg mb-6">
          Have questions or want to learn more? Feel free to contact us through
          our social networks or directly.
        </p>
        <div className="flex justify-center space-x-6">
          <a href="https://www.facebook.com/majstor.ba" aria-label="Facebook">
            <FaFacebook size={30} />
          </a>
          <a href="https://twitter.com/majstorba" aria-label="Twitter">
            <FaTwitter size={30} />
          </a>
          <a href="https://www.instagram.com/majstor.ba" aria-label="Instagram">
            <FaInstagram size={30} />
          </a>
        </div>
        <div className="flex justify-center space-x-8 mt-6">
          <div>
            <p className="font-bold">Email:</p>
            <p>info@majstor.ba</p>
          </div>
          <div>
            <p className="font-bold">Phone:</p>
            <p>(+387) 62-812/670</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
