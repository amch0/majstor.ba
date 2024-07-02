import React from "react";

const OnlineSecurityContent = () => {
  return (
    <div className="text-gray-800 bg-gray-90 shadow-md rounded-lg p-8 mb-10 text-justify">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Online Security Majstor.ba
      </h1>

      <p className="text-lg mb-4">
        Our commitment to your security is a key component of our platform. In
        order to have a positive experience, please comply of the above
        guidelines on online security.
      </p>

      <h2 className="text-2xl font-bold mb-4">1. Account Protection</h2>
      <p className="text-lg mb-4">
        Your password is a key line of defense. We recommend using a strong code
        that includes a combination of upper and lower case letters, numbers and
        special characters. Never share your password with others and it is
        regular change.
      </p>

      <h2 className="text-2xl font-bold mb-4">2. Caution in Communication</h2>
      <p className="text-lg mb-4">
        Your privacy is important. When communicating with other users, avoid
        sharing sensitive information such as bank details or personal addresses
        via private messages.
      </p>

      <h2 className="text-2xl font-bold mb-4">3. Updating the Software</h2>
      <p className="text-lg mb-4">
        Regularly update the operating system and antivirus software in order to
        maintained the latest security patches. This practice helps in
        conservation integrity of your digital environment.
      </p>

      <h2 className="text-2xl font-bold mb-4">4. How to Recognize Fraud</h2>
      <p className="text-lg mb-4">
        Be aware of scams and phishing attempts. Never click on suspicious links
        or open unknown attachments. If something works suspicious, report to us
        immediately.
      </p>

      <h2 className="text-2xl font-bold mb-4">
        5. Notification of Suspicious Activities
      </h2>
      <p className="text-lg mb-4">
        If you notice any suspicious activity on the platform, contact us
        immediately inform. A quick response is key to keeping everyone safe
        user.
      </p>

      <h2 className="text-2xl font-bold mb-4">Final Remarks</h2>
      <p className="text-lg mb-4">
        We are committed to your safety. Your cooperation helps to keep it safe
        online communities on Majstor.ba.
      </p>

      {/* Contact Information */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg mb-4">
          Do you have questions or want to learn more about our platform? Get in
          touch, here we are here to help you.
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

export default OnlineSecurityContent;
