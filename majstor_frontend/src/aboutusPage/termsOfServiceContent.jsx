import React from "react";

const TermsOfServiceContent = () => {
  return (
    <div className="text-gray-800 bg-white shadow-md rounded-lg p-8 mb-10 text-justify">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms of use</h1>

      <p className="text-lg mb-4">
        Welcome to Majstor.ba! Please read carefully and understand the
        following terms of use before continuing to use ours platform. By
        accessing or using any part of the Platform, you agree to these terms.
      </p>

      <h2 className="text-2xl font-bold mb-4">1. Registration and Orders</h2>
      <p className="text-lg mb-4">
        By registering, you agree to provide accurate, up-to-date and complete
        information about yourself as requested in the registration form form.
        You are responsible for maintaining the security of your account and
        responsible for all activities that take place under your order.
      </p>

      <h2 className="text-2xl font-bold mb-4">2. User Behavior</h2>
      <p className="text-lg mb-4 ">
        You agree to refrain from any behavior that could endanger you safety of
        other users or disrupt the functioning of the platform. Posting
        offensive, threatening or illegal content is prohibited content.
      </p>

      <h2 className="text-2xl font-bold mb-4">3. Data Privacy</h2>
      <p className="text-lg mb-4">
        Your privacy is important to us. Read our Privacy Policy yes to find out
        how we process and protect your data.
      </p>

      <h2 className="text-2xl font-bold mb-4">4. Responsibilities</h2>
      <p className="text-lg mb-4">
        Majstor.ba is not responsible for any damages or losses resulting from
        using the platform. Use it at your own risk.
      </p>

      <h2 className="text-2xl font-bold mb-4">Final Remarks</h2>
      <p className="text-lg">
        Please read these terms of use carefully. If you have If you have any
        additional questions or concerns, please feel free to contact us.
      </p>

      {/* Contact Information */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg mb-4">
          Do you have questions or want to learn more about our platform? Get in
          touch, here we are here to help you
        </p>
        <div className="flex items-center justify-center space-x-4">
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

export default TermsOfServiceContent;
