// src/components/ScrollManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    // 若有 hash（如 #section），让浏览器按默认行为；否则回到顶部
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname, location.search]); // 切路由或查询参数都触发

  return null;
}
