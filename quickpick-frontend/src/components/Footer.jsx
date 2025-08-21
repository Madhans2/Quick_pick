import { FaGithub, FaLinkedin, FaInstagram, FaGooglePlusG } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 px-6 py-10 shadow-md">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
        {/* About Section */}
        <div>
          <h4 className="font-semibold mb-2">About</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">Contact Us</li>
            <li className="cursor-pointer">About Us</li>
            <li className="cursor-pointer">Careers</li>
            <li className="cursor-pointer">Services</li>
          </ul>
        </div>

        {/* Groups Section */}
        <div>
          <h4 className="font-semibold mb-2">Groups</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">ArchitectCovai</li>
            <li className="cursor-pointer">Geethagarments</li>
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h4 className="font-semibold mb-2">Help</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">Payment</li>
            <li className="cursor-pointer">Orders</li>
            <li className="cursor-pointer">Profiles</li>
            <li className="cursor-pointer">FAQ</li>
          </ul>
        </div>

        {/* Consumer Policy Section */}
        <div>
          <h4 className="font-semibold mb-2">Consumer Policy</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">Cancellation</li>
            <li className="cursor-pointer">Return</li>
            <li className="cursor-pointer">Term of Use</li>
            <li className="cursor-pointer">Privacy</li>
            <li className="cursor-pointer">Sitemap</li>
          </ul>
        </div>

        {/* Developer Details */}
        <div>
          <h4 className="font-semibold mb-2">Developer Details</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">Madhan S</li>
            <li className="cursor-pointer">iammadhan28@gmail.com</li>
            <li className="cursor-pointer">Full-Stacker</li>
          </ul>
          <h4 className="font-semibold mt-4 mb-2">Social</h4>
          <div className="flex space-x-3 text-xl cursor-pointer">
            <FaGithub />
            <FaLinkedin />
            <FaInstagram />
            <FaGooglePlusG />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
