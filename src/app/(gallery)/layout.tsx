import { AppSidebar, getSidebarData } from "@/components/sidebar/app-sidebar";
import { MobileHeader } from "@/components/sidebar/mobile-header";

export default async function GalleryLayout({ children }: LayoutProps<"/">) {
  const sidebarData = await getSidebarData();
  return (
    <div className="flex min-h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader {...sidebarData} />
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
