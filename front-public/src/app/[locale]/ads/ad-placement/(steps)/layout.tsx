import { ViewHeader, StepProgress } from "@/lib/views/ad-placement/components";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ViewHeader />
      <StepProgress />
      {props.children}
    </div>
  );
}
