import { Header, type HeaderRoute } from "#/components/page/main/header";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "#/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import type { FetcherWithComponents } from "react-router";

interface LogViewerProps {
  headerRoutes: HeaderRoute[];
  pageTitle: string;
  pageDescription: string;
  cardTitle: string;
  logContent: string | null | undefined;
  showClearButton: boolean;
  fetcher?: FetcherWithComponents<any>; // Optional fetcher for clear action
  onClear?: () => void; // Optional callback for clear action
}

export function LogViewer({
  headerRoutes,
  pageTitle,
  pageDescription,
  cardTitle,
  logContent,
  showClearButton,
  fetcher,
  onClear
}: LogViewerProps) {
  const isClearing = fetcher?.state !== 'idle';

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10">
        <Header routes={headerRoutes}>
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{pageTitle}</h1>
              <p className="text-muted-foreground text-sm">{pageDescription}</p>
            </div>
            {showClearButton && fetcher && onClear && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isClearing}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isClearing ? '清理中...' : '清理日志'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认清理日志</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作将清空当前记录的所有日志，且不可恢复。是否继续？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onClear}
                      disabled={isClearing}
                    >
                      {isClearing ? '处理中...' : '确认'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </Header>
      </div>

      <div className="container mx-auto py-6 flex-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {logContent?.split("\n").reverse().join("\n").trim() || "暂无日志记录"}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 