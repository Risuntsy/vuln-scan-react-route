import { useState } from "react";
import type { SetURLSearchParams, useSearchParams } from "react-router";
import { Button } from "#/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

export function CustomPagination({
  total,
  pageIndex,
  pageSize,
  setSearchParams
}: {
  total: number;
  pageIndex: number;
  pageSize: number;
  setSearchParams: SetURLSearchParams;
}) {
  const [isPageInputOpen, setIsPageInputOpen] = useState(false);
  const [pageInput, setPageInput] = useState(String(pageIndex));
  const totalPages = Math.ceil(total / pageSize);
  const canGoPrev = pageIndex > 1;
  const canGoNext = pageIndex < totalPages;

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams(prev => {
      prev.set("pageIndex", String(newPageIndex));
      return prev;
    });
  };

  const handlePageInputConfirm = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
    setIsPageInputOpen(false);
    setPageInput(String(pageIndex));
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => handlePageChange(pageIndex - 1)} disabled={!canGoPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {isPageInputOpen ? (
        <div className="flex items-center justify-center gap-2">
          <Input
            type="number"
            value={pageInput}
            onChange={e => setPageInput(e.target.value)}
            className="w-20 text-center"
            min={1}
            max={totalPages}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handlePageInputConfirm();
              } else if (e.key === "Escape") {
                setIsPageInputOpen(false);
                setPageInput(String(pageIndex));
              }
            }}
          />
          <Button size="sm" onClick={handlePageInputConfirm}>
            确定
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="w-16 text-center" onClick={() => {
          setIsPageInputOpen(true);
          setPageInput(String(pageIndex));
        }}>
          第 {pageIndex} 页
        </Button>
      )}
      
      <Button variant="outline" size="sm" onClick={() => handlePageChange(pageIndex + 1)} disabled={!canGoNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}



interface PaginationControlsProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
}

const PAGE_SIZES = [10, 20, 50];

export function PaginationControls({ pageIndex, pageSize, total, setSearchParams }: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams(prev => {
      prev.set("pageIndex", newPageIndex.toString());
      return prev;
    });
  };

  const handleSizeChange = (newPageSize: string) => {
    setSearchParams(prev => {
      prev.set("pageSize", newPageSize);
      prev.set("pageIndex", "1");
      return prev;
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sticky bottom-0 bg-background py-3 border-t px-6">
      <div className="text-sm text-muted-foreground">
        显示 {total > 0 ? (pageIndex - 1) * pageSize + 1 : 0}-{Math.min(pageIndex * pageSize, total)} 共 {total} 条记录
      </div>
      <div className="flex items-center space-x-2">
        <Select defaultValue={pageSize.toString()} onValueChange={handleSizeChange}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map(s => (
              <SelectItem key={s} value={s.toString()}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex <= 1}
            className="h-8"
          >
            上一页
          </Button>
          <span className="text-xs whitespace-nowrap">
            第 {pageIndex} 页 / 共 {totalPages > 0 ? totalPages : 1} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages}
            className="h-8"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}
