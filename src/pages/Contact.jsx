import { FaPhoneAlt, FaFax, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();

  // ---- 地址与外链
  const addressText = "12440 Bridgeport Road, Richmond, B.C., V6V 1J5";
  const googleQuery = encodeURIComponent(addressText);
  const googleMapsUrl = `https://www.google.com/maps?q=${googleQuery}`;

  // ---- 地图懒加载 & 交互开关
  const mapWrapRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapInteractive, setMapInteractive] = useState(false);

  useEffect(() => {
    const el = mapWrapRef.current;
    if (!el || mapVisible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMapVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mapVisible]);

  const items = useMemo(
    () => [
      {
        icon: FaMapMarkerAlt,
        label: t("address", t("adress")),
        value: addressText,
      },
      {
        icon: FaPhoneAlt,
        label: t("phone"),
        value: "+1-604-244-7234",
      },
      {
        icon: FaFax,
        label: t("fax"),
        value: "+1-604-273-5820",
      },
      {
        icon: FaEnvelope,
        label: t("email"),
        value: "admin@bristar.ca",
      },
    ],
    [t]
  );

  return (
    <section className="px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-serif font-bold text-center mb-8 md:mb-12">
        📍 {t("homeContact")}
      </h2>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* 左侧：联系方式 */}
        <address className="not-italic text-gray-700 text-sm md:text-base space-y-4 md:space-y-6">
          {items.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon aria-hidden className="mt-1 text-red-500" />
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">{label}</div>
                {href ? (
                  <a
                    href={href}
                    className="text-gray-700 hover:text-red-600 underline underline-offset-2 decoration-dotted break-words"
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {value}
                  </a>
                ) : (
                  <span className="break-words">{value}</span>
                )}
              </div>
            </div>
          ))}

          {/* 外链按钮：获取路线 */}
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
            >
              {t("googleMap")}
            </a>
          </div>
        </address>

        {/* 右侧：地图（懒加载 + 点击启用交互） */}
        <div ref={mapWrapRef} className="w-full">
          <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
            {/* 骨架屏 */}
            {!mapVisible && (
              <div className="animate-pulse h-[320px] md:h-[480px] bg-gradient-to-br from-gray-200 to-gray-100" />
            )}

            {mapVisible && (
              <div className="relative group">
                <iframe
                  title="Google Map"
                  src={`https://www.google.com/maps?q=${googleQuery}&output=embed`}
                  className="w-full h-[320px] md:h-[480px] border-0"
                  loading="lazy"
                  allowFullScreen
                  // 默认不拦截滚动，点击后才互动
                  style={{ pointerEvents: mapInteractive ? "auto" : "none" }}
                />
                {!mapInteractive && (
                  <button
                    type="button"
                    onClick={() => setMapInteractive(true)}
                    className="absolute inset-0 grid place-content-center bg-black/0 hover:bg-black/10 transition"
                    aria-label="Enable map interaction"
                  >
                    <span className="btn btn-sm md:btn-md btn-neutral">
                      {t("clickToInteract")}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
