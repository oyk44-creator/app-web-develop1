import DesktopNavbar from "@/components/layout/header/DesktopNavbar";
import MobileNavbar from "@/components/layout/header/MobileNavbar";
import React from "react";

const Header = () => {
  const headerLink = [
    {
      name: "홈",
      link: `/`,
    },
    {
      name: "회사 소개",
      link: `/about`,
    },

    {
      name: "연락처",
      link: `/contact`,
    },
  ];

  return (
    <section className="py-4">
      <div className="container">
        <DesktopNavbar headerLink={headerLink} />
        <MobileNavbar headerLink={headerLink} />
      </div>
    </section>
  );
};

export default Header;
