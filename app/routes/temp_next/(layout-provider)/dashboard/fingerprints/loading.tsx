import { Card, CardContent } from "#/components";
import { Skeleton } from "#/components";

export default function Loading() {
    return (
        <div>
            <div className="flex items-center justify-between p-6 border-b">
                <div>
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-10 w-[250px]" />
                                <Skeleton className="h-10 w-[120px]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-10 w-[80px]" />
                                <Skeleton className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <div className="p-4">
                                <div className="grid gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    {Array(5)
                                        .fill(0)
                                        .map((_, index) => (
                                            <Skeleton key={index} className="h-16 w-full" />
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <Skeleton className="h-5 w-48" />
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-9 w-20" />
                                <Skeleton className="h-9 w-20" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
