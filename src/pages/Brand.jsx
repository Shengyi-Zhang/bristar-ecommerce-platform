// src/pages/Brand.jsx
import { useTranslation } from "react-i18next";

export default function Brand() {
  const { t } = useTranslation();

  return (
    <main
      aria-labelledby="brand-title"
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-[env(safe-area-inset-top)] py-10 sm:py-12 lg:py-16 bg-white"
    >
      <h1
        id="brand-title"
        className="text-center text-2xl sm:text-3xl md:text-5xl font-semibold tracking-wide mb-6 sm:mb-8"
      >
        {t("ourBrand")}
      </h1>

      <figure className="flex justify-center">
        <img
          src="/assets/brand.jpg"
          alt="Lotus Brand Logo"
          loading="lazy"
          decoding="async"
          className="
            w-11/12 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl
            rounded-lg shadow-md bg-gray-50
            aspect-[4/3] object-contain
          "
          /* Responsive hint for the browser to pick the right size */
          sizes="(min-width:1024px) 640px, (min-width:640px) 480px, 90vw"
        />
      </figure>
    </main>
  );
}
