import { FaPhoneAlt, FaFax, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-center mb-12">
        📍 {t("homeContact")}
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Side: Contact Info */}
        <div className="space-y-6 text-gray-700 text-sm md:text-base">
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-red-500 mt-1" />
            <p>
              <strong>{t("adress")}:</strong> <br />
              12440 Bridgeport Road, Richmond, B.C., V6V 1J5
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-blue-500" />
            <p>
              <strong>{t("phone")}:</strong> +1-604-244-7234
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaFax className="text-gray-500" />
            <p>
              <strong>{t("fax")}:</strong> +1-604-273-5820
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-red-500" />
            <p>
              <strong>{t("email")}:</strong>{" "}
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
