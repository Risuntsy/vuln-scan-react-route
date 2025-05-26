import * as React from "react";

import { Card, CardContent, type CarouselApi } from "#/components";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "#/components";

export default function CarouselSpacing() {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;
    api.scrollTo(5);
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="">
      <Carousel className="max-h-screen max-w-sm" setApi={setApi} opts={{ loop: true }} orientation="vertical">
        <CarouselContent className="-ml-1 max-h-screen">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
