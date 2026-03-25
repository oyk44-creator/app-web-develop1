"use client";

import Link from "next/link";
import React from "react";
import {
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

import LogoImage from "@/components/shared/LogoImage";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export interface IHeaderNavigation {
  name: string;
  link: string;
}

interface DesktopNavbarProps {
  headerLink: IHeaderNavigation[];
}

const menuItems = [
  { path: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { path: "/data/upload", label: "데이터 업로드", icon: CloudUpload },
  { path: "/data/list", label: "데이터 목록", icon: List },
  { path: "/charts", label: "차트", icon: BarChart3 },
];

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ headerLink }) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="hidden justify-between lg:flex">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/">
          <LogoImage alt={"worldkjob Logo"} width={80} height={80} />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {headerLink?.map((item) => (
              <NavigationMenuItem key={item.link}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={item.link}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* Auth-protected menu items */}
            {user &&
              menuItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.path}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

            {/* Admin menu */}
            {user?.role === "admin" && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/admin">관리자</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm text-muted-foreground">
                  {user.email || "Unknown"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button asChild>
              <Link href="/register">회원가입</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                <LogInIcon className="h-4 w-4" />
                로그인
              </Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default DesktopNavbar;
