import { Link } from "react-router-dom";
import NewItemsCarousel from "../components/NewItemCarousel";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-24 bg-white">
        <h1 className="text-5xl md:text-6xl font-light tracking-wide">
          BRISTAR INTERNATIONAL
        </h1>
        <p className="text-xl text-gray-600 mt-4">永 輝 國 際 貿 易</p>
        <hr className="border-t-4 border-red-600 w-28 mx-auto my-6" />
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

      {/* Brand Section */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-xl font-semibold text-center mb-8">
          {t("ourBrand")}
        </h2>
        <div className="flex justify-center flex-wrap gap-8 items-center">
          <img src="/assets/brand.jpg" className="h-12 transition" />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-2xl font-semibold mb-4">{t("homeContactTitle")}</h2>
        <p className="text-gray-600 mb-6">{t("homeContactInfo")}</p>
        <Link to="/contact" className="btn btn-outline btn-wide">
          {t("homeContact")}
        </Link>
      </section>
    </div>
  );
}
