import React from "react";

const PrivacyPolicyContent = () => {
  return (
    <div className="text-gray-800 bg-white shadow-md rounded-lg p-11  text-justify ">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Privacy Policy at Majstor.ba
      </h1>

      <p className="text-lg mb-4">
        Your privacy is essential to us. This policy privacy policy explains in
        detail how we collect, use and protect your personal data on Majstor.ba.
      </p>

      <h2 className="text-2xl font-bold mb-4">1. Data Collection</h2>
      <p className="text-lg mb-4">
        To provide you with a better user experience, we collect certain
        personal data, including information such as name, address and email
        addresses.
      </p>

      <h2 className="text-2xl font-bold mb-4">2. Use of Data</h2>
      <p className="text-lg mb-4">
        Your data is used exclusively for the purpose of providing and improving
        services that we offer. Your consent is essential, and we will not share
        your information with to third parties without your consent.
      </p>

      <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
      <p className="text-lg mb-4">
        We have implemented security measures to protect your data from
        unauthorized access or change. Your privacy is our priority.
      </p>

      <h2 className="text-2xl font-bold mb-4">4. Tracking and Cookies</h2>
      <p className="text-lg mb-4">
        As part of our privacy policy, we inform you about the use of cookies
        and tracking technology when visiting our platform. More details you can
        find in our section about cookies.
      </p>

      <h2 className="text-2xl font-bold mb-4">Final Remarks</h2>
      <p className="text-lg mb-4">
        If you have additional questions or concerns about our policy privacy,
        feel free to contact us. Thank you for your trust and using Majstor.ba.
      </p>

      {/* Contact Information */}
      <div className="mt-12 text-center ">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg mb-4">
          Do you have questions or want to learn more about our platform? Get in
          touch, here we are here to help you.
        </p>
        <div className="flex items-center justify-center space-x-4">
          {/* Enter your contact details here */}
          <div>
            <p className="font-bold">Email:</p>
            <p>info@majstor.ba</p>
          </div>
          <div>
            <p className="font-bold">Phone:</p>
            <p>(555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
