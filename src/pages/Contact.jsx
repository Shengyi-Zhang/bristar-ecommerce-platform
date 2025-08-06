// // Contact.jsx
// export default function Contact() {
//   return (
//     <section className="px-6 py-16 max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold mb-8 text-center font-serif">
//         📍 Contact Us
//       </h2>

//       <div className="space-y-4 text-lg text-gray-700">
//         <p>
//           <strong className="text-black">Address:</strong> 12440 Bridgeport
//           Road, Richmond, B.C., V6V 1J5
//         </p>
//         <p>
//           <strong className="text-black">Phone:</strong> +1-604-244-7234
//         </p>
//         <p>
//           <strong className="text-black">Fax:</strong> +1-604-273-5820
//         </p>
//         <p>
//           <strong className="text-black">Email:</strong>{" "}
//           <a
//             href="mailto:admin@bristar.ca"
//             className="text-red-600 hover:underline"
//           >
//             admin@bristar.ca
//           </a>
//         </p>
//       </div>

//       <div className="mt-10 rounded overflow-hidden shadow-lg border">
//         <iframe
//           title="Google Map"
//           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2603.870432070788!2d-123.10204568430929!3d49.1923464793274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54860a85aee49fb7%3A0xafe4e07e2b8f6dd4!2s12440%20Bridgeport%20Rd%2C%20Richmond%2C%20BC%20V6V%201J5%2C%20Canada!5e0!3m2!1sen!2sca!4v1693424827397!5m2!1sen!2sca"
//           width="100%"
//           height="400"
//           style={{ border: 0 }}
//           allowFullScreen=""
//           loading="lazy"
//           referrerPolicy="no-referrer-when-downgrade"
//         ></iframe>
//       </div>
//     </section>
//   );
// }
import { FaPhoneAlt, FaFax, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-center mb-12">
        📍 Contact Us
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Side: Contact Info */}
        <div className="space-y-6 text-gray-700 text-sm md:text-base">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-red-500 mt-1" />
            <p>
              <strong>Address:</strong> <br />
              12440 Bridgeport Road, Richmond, B.C., V6V 1J5
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-blue-500" />
            <p>
              <strong>Phone:</strong> +1-604-244-7234
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaFax className="text-gray-500" />
            <p>
              <strong>Fax:</strong> +1-604-273-5820
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-red-500" />
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:admin@bristar.ca"
                className="text-red-600 underline hover:text-red-800"
              >
                admin@bristar.ca
              </a>
            </p>
          </div>
        </div>

        {/* Right Side: Google Map */}
        <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=12440%20Bridgeport%20Road,%20Richmond,%20BC,%20Canada&output=embed"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
            style={{ pointerEvents: "auto" }}
          ></iframe>
        </div>
      </div>
    </section>
  );
}
