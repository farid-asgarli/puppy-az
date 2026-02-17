import { ReactNode, useState, useCallback, useMemo, Key } from "react";
import { Table, Input, Button, Space, TablePaginationConfig } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { useTranslation } from "react-i18next";
import { TableSkeleton } from "./Skeletons";
import { EmptyState, ErrorState } from "./EmptyState";

export interface DataTableProps<T extends object> {
  columns: ColumnsType<T>;
  data: T[];
  loading?: boolean;
  error?: Error | null;
  rowKey: keyof T | ((record: T) => Key);
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onCreate?: () => void;
  createLabel?: string;
  onRowClick?: (record: T) => void;
  extraActions?: ReactNode;
  scroll?: TableProps<T>["scroll"];
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  showHeader?: boolean;
  title?: () => ReactNode;
  footer?: () => ReactNode;
  rowSelection?: TableProps<T>["rowSelection"];
}

export function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  error = null,
  rowKey,
  pagination,
  searchable = true,
  searchPlaceholder,
  onSearch,
  onRefresh,
  onCreate,
  createLabel,
  onRowClick,
  extraActions,
  scroll = { x: "max-content" },
  size = "middle",
  bordered = false,
  showHeader = true,
  title,
  footer,
  rowSelection,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearch?.(value);
    },
    [onSearch],
  );

  const handleTableChange = useCallback(
    (
      paginationConfig: TablePaginationConfig,
      _filters: Record<string, FilterValue | null>,
      _sorter: SorterResult<T> | SorterResult<T>[],
    ) => {
      if (pagination) {
        pagination.onChange(
          paginationConfig.current || 1,
          paginationConfig.pageSize || pagination.pageSize,
        );
      }
    },
    [pagination],
  );

  const tablePagination = useMemo(() => {
    if (!pagination) return false;
    return {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number, range: [number, number]) =>
        `${range[0]}-${range[1]} / ${total}`,
      pageSizeOptions: ["10", "20", "50", "100"],
      align: "center" as const,
    };
  }, [pagination]);

  // Memoize columns for performance
  const memoizedColumns = useMemo(() => columns, [columns]);

  // Show skeleton while loading
  if (loading && data.length === 0) {
    return (
      <div className="card">
        <TableSkeleton
          rows={pagination?.pageSize || 10}
          columns={columns.length}
        />
      </div>
    );
  }

  // Show error state
  if (error && data.length === 0) {
    return (
      <div className="card">
        <ErrorState description={error.message} onRetry={onRefresh} />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      {(searchable || onCreate || extraActions || onRefresh) && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            {searchable && (
              <div className="flex-1 max-w-md">
                <Input
                  placeholder={searchPlaceholder || t("common.search")}
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
              </div>
            )}

            {/* Actions */}
            <Space wrap>
              {extraActions}
              {onRefresh && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                  loading={loading}
                >
                  {t("common.refresh")}
                </Button>
              )}
              {onCreate && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onCreate}
                >
                  {createLabel || t("common.create")}
                </Button>
              )}
            </Space>
          </div>
        </div>
      )}

      {/* Table */}
      <Table<T>
        columns={memoizedColumns}
        dataSource={data}
        rowKey={rowKey as string | ((record: T) => Key)}
        loading={loading}
        pagination={tablePagination}
        onChange={handleTableChange}
        scroll={scroll}
        size={size}
        bordered={bordered}
        showHeader={showHeader}
        title={title}
        footer={footer}
        rowSelection={rowSelection}
        onRow={
          onRowClick
            ? (record) => ({
                onClick: () => onRowClick(record),
                style: { cursor: "pointer" },
              })
            : undefined
        }
        locale={{
          emptyText: <EmptyState />,
        }}
        className="[&_.ant-table-cell]:!py-3"
      />
    </div>
  );
}
