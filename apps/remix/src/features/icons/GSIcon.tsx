export function GSIcon({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={"0 0 420 420"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <path d="M100 0C44.7715 0 0 44.7715 0 100V320C0 375.228 44.7715 420 100 420H320C375.228 420 420 375.228 420 320V260C420 204.772 375.228 150 320 150H180L215.355 195.355C224.732 204.732 236.739 210 250 210H320C342.091 210 360 227.909 360 250V320C360 344 344 360 320 360H100C74 360 60 344 60 320V300H250L214.645 264.645C205.268 255.268 193.261 240 180 240H100C72.3858 240 60 227.614 60 200V100C60 74 74 60 100 60H320C340 60 360 80 360 100H420C420 44.7715 375.228 0 320 0H100Z" />
    </svg>
  );
}
