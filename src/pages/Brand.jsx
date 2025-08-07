import { useTranslation } from "react-i18next";
export default function Brand() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-24">
      <h1 className="text-4xl md:text-5xl font-semibold text-black mb-12 tracking-wide">
        {t("ourBrand")}
      </h1>
      <img
        src="/assets/brand.jpg"
        alt="Lotus Brand Logo"
        className="max-w-xs md:max-w-md lg:max-w-lg shadow-md rounded-lg"
      />
    </div>
  );
}
