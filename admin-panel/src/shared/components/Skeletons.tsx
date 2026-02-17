import { Skeleton } from "antd";

export function TableSkeleton({
  rows = 5,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton.Input
            key={i}
            active
            size="small"
            style={{ width: `${100 / columns}%` }}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton.Input
              key={colIndex}
              active
              size="small"
              style={{ width: `${100 / columns}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton.Input active size="large" style={{ width: "60%" }} />
      <Skeleton active paragraph={{ rows: 3 }} />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton.Input active size="small" style={{ width: 100 }} />
          <Skeleton.Input active size="large" style={{ width: 80 }} />
        </div>
        <Skeleton.Avatar active size={48} shape="square" />
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton.Input active size="small" style={{ width: 120 }} />
          <Skeleton.Input active block />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton.Button active />
        <Skeleton.Button active />
      </div>
    </div>
  );
}
