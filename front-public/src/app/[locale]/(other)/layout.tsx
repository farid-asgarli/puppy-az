import { NavbarConstants } from '@/lib/components/navbar/constants';
import DesktopNavbar from '@/lib/components/navbar/desktop-navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopNavbar isSticky={true} />
      <div style={{ marginTop: NavbarConstants.NAVBAR_HEIGHT_COLLAPSED }}>{children}</div>
    </>
  );
}
