import MobileBottomNav from '@/lib/components/footer/mobile-bottom-nav';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      {props.children}
      <MobileBottomNav />
    </>
  );
}
