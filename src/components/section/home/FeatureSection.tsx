import { Button } from "@/components/ui/button";
import { MockProps } from "@/lib/types/home";
import Image from "next/image";

export default function FeatureSection({
  item,
  imageRight = false,
}: {
  item: MockProps;
  imageRight?: boolean;
}) {
  return (
    <section className="py-8">
      <div className="container">
        <div className="grid place-items-center md:gap-16 lg:grid-cols-2">
          <div
            className={`flex flex-col items-center text-center lg:items-start lg:text-left ${imageRight ? "order-2 lg:order-1" : "order-2 lg:order-2"}`}
          >
            <h2 className="my-6 mt-0 text-primary lg:text-5xl">{item.title}</h2>
            {item.description && (
              <p className="mb-8 max-w-xl px-2 text-gray-800 text-muted-foreground lg:text-xl">
                {item.description}
              </p>
            )}
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button asChild>
                <a href={item.buttonPrimary.href} target="_blank">
                  {item.buttonPrimary.text}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={item.buttonSecondary.href} target="_blank">
                  {item.buttonSecondary.text}
                </a>
              </Button>
            </div>
          </div>

          <Image
            src={
              imageRight
                ? "/images/home/mission.png"
                : "/images/home/vision.png"
            }
            alt={"이미지"}
            width={400}
            height={400}
            className="order-1 mb-2 flex h-64 w-64 rounded-full sm:mb-0 sm:h-96 sm:w-96 lg:order-1"
          />
        </div>
      </div>
    </section>
  );
}
