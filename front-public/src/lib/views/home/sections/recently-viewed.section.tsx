import { RecentlyViewed } from '@/lib/components/recently-viewed';

export const RecentlyViewedSection = () => {
  return (
    <section className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8 sm:space-y-10">
          {/* Carousel */}
          <RecentlyViewed />
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
