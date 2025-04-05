import { useState } from "react";
import type { SetURLSearchParams } from "react-router";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";

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