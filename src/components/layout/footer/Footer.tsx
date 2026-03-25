import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import { FaThreads } from "react-icons/fa6";

import Link from "next/link";
import LogoImage from "@/components/shared/LogoImage";

const Footer = async () => {
  const footerSections = [
    // {
    //   title: "페이지",
    //   links: [
    //     {
    //       name: "공지사항",
    //       href: `/notice`,
    //     },
    //     {
    //       name: "채용",
    //       href: `/job`,
    //     },
    //     {
    //       name: "회사",
    //       href: `/company`,
    //     },
    //   ],
    // },
    {
      title: "회사",
      links: [
        {
          name: "회사 소개",
          href: `/about`,
        },
        {
          name: "연락처",
          href: `/contact`,
        },
        {
          name: "이용 약관",
          href: `/terms`,
        },
        {
          name: "개인정보 처리방침",
          href: `/privacy`,
        },
        {
          name: "법적 고지",
          href: `/legal`,
        },
      ],
    },
  ];

  return (
    <section>
      <div className="container py-12">
        <footer>
          <div className="flex flex-col justify-between gap-10 text-center lg:flex-row lg:items-start lg:text-left">
            <div className="flex w-full shrink flex-col items-center justify-between gap-6 lg:max-w-96 lg:items-start">
              {/* Logo */}
              <Link href={""}>
                <LogoImage
                  alt={"Logo"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </Link>

              <ul className="flex items-center space-x-6 text-muted-foreground">
                <li className="font-medium hover:text-primary">
                  <a href="#">
                    <FacebookIcon className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <FaThreads className="size-6" />
                  </a>
                </li>
                <li className="font-medium hover:text-primary">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <LinkedinIcon className="size-6" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {footerSections?.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-6 font-bold text-primary">
                    {section.title}
                  </h3>
                  <ul className="space-y-4 break-words text-sm text-muted-foreground">
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className="font-medium hover:text-primary"
                      >
                        <a href={link.href}>{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
            <p>© 2025 퓨처모빌리티AI All rights reserved.</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
