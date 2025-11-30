"use client";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Bell,
  BookMarked,
  HeartPulse,
  Home,
  NotepadText,
  Settings2,
} from "lucide-react";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import useUserStore from "@/app/Store/user.store";

const SidebarLogo = () => {
  const { state } = useSidebar();

  return (
    <div
      className={clsx(
        "flex items-center lg:px-0 lg:py-0 px-3 py-2 lg:mt-5"
      )}
    >
      <div className={clsx("shrink-0")}>
        <Image
          src={logo}
          width={40}
          height={40}
          alt="logo"
          className={clsx(
            "rounded-md transition-all ease",
            state === "collapsed" ? "size-9" : "size-15"
          )}
        />
      </div>
      {state !== "collapsed" && (
        <p className="text-3xl font-semibold truncate">xTask</p>
      )}
    </div>
  );
};

const SidebarUser = ({ user }) => {
  const { state } = useSidebar();
  return (
    <div className="flex items-center gap-3 lg:p-0 px-3 py-2">
      <div className="h-10 w-10 relative shrink-0">
        <img
          src={user?.avatar || "/pro.png"}
          alt="profile"
          className="w-full h-full rounded-full object-cover "
        />
      </div>

      {state !== "collapsed" && (
        <div className="flex flex-col truncate leading-6">
          <h3 className="font-semibold truncate">{user?.displayName}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      )}
    </div>
  );
};

const SideBarChild = () => {
  const userData = useUserStore((state) => state);
  const { state } = useSidebar();
  const path = usePathname();
  const tabs = [
    { name: "Dashboard", icon: Home, link: "/" },
    { name: "Tasks", icon: NotepadText, link: "/tasks" },
    { name: "Projects", icon: BookMarked, link: "/projects" },
    { name: "Analytics", icon: HeartPulse, link: "/analytics" },
    { name: "Notifications", icon: Bell, link: "/notifications" },
    { name: "Settings", icon: Settings2, link: "/settings" },
  ];

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.map((item) => {
                  const isActive =
                    item.link === "/"
                      ? path === "/"
                      : path.startsWith(item.link);

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        className={clsx(
                          "flex items-center gap-2 transition-colors",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-secondary-foreground"
                        )}
                      >
                        <Link href={item.link}>
                          <item.icon className="w-5 h-5" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter
          className={clsx("py-5 transition-all ease", state === "collapsed" ? "px-0" : "px-5")}
        >
          <SidebarUser user={userData} />
        </SidebarFooter>
      </Sidebar>
      {/* {path !== "/" && ( */}
      <div className="lg:relative lg:-top-2 fixed top-0 left-0 z-50">
        <SidebarTrigger />
      </div>
      {/* )} */}
    </>
  );
};

const AppSideBar = () => {
  return (
    <SidebarProvider>
      <SideBarChild />
    </SidebarProvider>
  );
};

export default AppSideBar;
