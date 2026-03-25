"use client";

import {
  Menu,
  LayoutDashboard,
  CloudUpload,
  List,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  LogInIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogoImage from "@/components/shared/LogoImage";
import { useAuth } from "@/hooks/useAuth";

interface MobileNavbarProps {
  headerLink: any[];
}

const menuItems = [
  { path: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { path: "/data/upload", label: "데이터 업로드", icon: CloudUpload },
  { path: "/data/list", label: "데이터 목록", icon: List },
  { path: "/charts", label: "차트", icon: BarChart3 },
  { path: "/settings", label: "설정", icon: Settings },
];

const MobileNavbar: React.FC<MobileNavbarProps> = ({ headerLink }) => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      setOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="block lg:hidden">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href={"/"}>
          <LogoImage alt={"worldkjob Logo"} width={60} height={60} />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                <Link href={"/"} onClick={() => setOpen(false)}>
                  <LogoImage alt={"worldkjob Logo"} width={60} height={60} />
                </Link>
              </SheetTitle>
              {user && (
                <p className="mt-2 text-left text-sm text-muted-foreground">
                  {user.email || "Unknown"}
                </p>
              )}
            </SheetHeader>

            <div className="flex h-full flex-col">
              <div className="flex flex-grow flex-col gap-6 p-4">
                {/* Public navigation */}
                <nav className="flex flex-col gap-4">
                  {headerLink.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      className="text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Auth-protected navigation */}
                {user && (
                  <>
                    <Separator />
                    <nav className="flex flex-col gap-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.path}
                            variant="ghost"
                            className="justify-start gap-3"
                            asChild
                            onClick={() => setOpen(false)}
                          >
                            <Link href={item.path}>
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Link>
                          </Button>
                        );
                      })}
                    </nav>

                    {/* Admin menu */}
                    {user.role === "admin" && (
                      <>
                        <Separator />
                        <Button
                          variant="ghost"
                          className="justify-start gap-3"
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/admin">
                            <ShieldCheck className="h-5 w-5" />
                            <span>관리자</span>
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* 하단 고정 영역 */}
              <div className="mb-4 flex flex-col gap-3 p-4">
                {user ? (
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </Button>
                ) : (
                  <>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/register">
                        <UserIcon className="mr-2 h-4 w-4" />
                        회원가입
                      </Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/login">
                        <LogInIcon className="h-4 w-4" />
                        로그인
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
