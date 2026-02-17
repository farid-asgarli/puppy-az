import { Spin } from "antd";

export function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative">
          {/* Logo or brand icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center animate-pulse-slow">
            <span className="text-3xl font-bold text-white">P</span>
          </div>

          {/* Loading spinner */}
          <Spin size="large" />
        </div>

        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
