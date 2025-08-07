import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="navbar bg-base-100 shadow-sm px-6">
      <div className="flex-1">
        <Link to="/" className="font-bold tracking-wide">
          <img src="/assets/icon.png" alt="Logo" className="h-20 w-30" />
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link to="/">{t("home")}</Link>
          </li>

          {/* ⬇️ Products Dropdown */}
          <li tabIndex={0}>
            <details>
              <summary>{t("products")}</summary>
              <ul className="p-2 bg-base-100 z-[1] shadow rounded-box w-52">
                <li>
                  <Link to="/products?category=New Item">{t("new item")}</Link>
                </li>
                <li>
                  <Link to="/products?category=Beverage">{t("beverage")}</Link>
                </li>
                <li>
                  <Link to="/products?category=Canned and Dried">
                    {t("canned and dried")}
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Grains and Beans">
                    {t("grains and beans")}
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Houseware">
                    {t("houseware")}
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Joss">{t("joss")}</Link>
                </li>
                <li>
                  <Link to="/products?category=Noodle">{t("noodle")}</Link>
                </li>
                <li>
                  <Link to="/products?category=Sauce and Paste">
                    {t("sauce and paste")}
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Seaoning and Spice">
                    {t("seasoning and spice")}
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Snack">{t("snack")}</Link>
                </li>
                <li>
                  <Link to="/products?category=Tea">{t("tea")}</Link>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <Link to="/contact">{t("contact")}</Link>
          </li>

          <li>
            <button
              className="btn btn-sm btn-outline"
              onClick={() =>
                i18n.changeLanguage(i18n.language === "en" ? "zh" : "en")
              }
            >
              🌐 {i18n.language === "en" ? "中文" : "EN"}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
