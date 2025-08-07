import { Link } from "react-router-dom";
import NewItemsCarousel from "../components/NewItemCarousel";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 bg-white">
        <h1 className="text-5xl md:text-6xl font-light tracking-wide">
          BRISTAR INTL TRADING LTD.
        </h1>

        <p className="text-2xl text-gray-600 mt-4">永 輝 國 際 貿 易</p>
        <hr className="border-t-4 border-red-600 w-36 mx-auto my-6 " />
        <p className="max-w-xl mx-auto text-gray-500 text-sm">
          Asian Food Importer & Distributor in Vancouver
        </p>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">{t("ourCompany")}</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          {t("ourCompanyInfo")}
        </p>
      </section>

      {/* New Item Grid */}
      <NewItemsCarousel />

      {/* Contact CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-2xl font-semibold mb-4">{t("contactTitle")}</h2>
        <p className="text-gray-600 mb-6">{t("homeContactInfo")}</p>
        <Link to="/contact" className="btn btn-outline btn-wide">
          {t("homeContact")}
        </Link>
      </section>
    </div>
  );
}
