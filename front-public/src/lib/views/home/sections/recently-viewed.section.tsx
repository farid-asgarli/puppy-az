import { RecentlyViewed } from "@/lib/components/recently-viewed";

export const RecentlyViewedSection = () => {
  return (
    <section className="bg-white pt-0 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8">
          {/* Carousel */}
          <RecentlyViewed />
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
