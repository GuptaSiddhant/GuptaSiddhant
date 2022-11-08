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
      viewBox={"0 0 100 100"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 20C0 8.9543 8.95431 0 20 0H80C91.0457 0 100 8.95431 100 20V25C100 27.7614 97.7614 30 95 30H91V20C91 13.9249 86.0751 9 80 9H20C13.9249 9 9 13.9249 9 20V51C9 57.0751 13.9249 62 20 62V70.391C18.9932 69.5241 17.6828 69 16.25 69H9V80C9 86.0751 13.9249 91 20 91H80C86.0751 91 91 86.0751 91 80V60C91 53.9249 86.0751 49 80 49H55L45 40H80C91.0457 40 100 48.9543 100 60V80C100 91.0457 91.0457 100 80 100H20C8.9543 100 0 91.0457 0 80V20ZM42 40H25C22.2386 40 20 37.7614 20 35V25C20 22.2386 22.2386 20 25 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 82.2386 30 85 30H89V20C89 15.0294 84.9706 11 80 11H20C15.0294 11 11 15.0294 11 20V51C11 55.9706 15.0294 60 20 60H63.5H75C77.7614 60 80 62.2386 80 65V75C80 77.7614 77.7614 80 75 80H25C22.2386 80 20 77.7614 20 75V74.75C20 72.6789 18.3211 71 16.25 71H11V80C11 84.9706 15.0294 89 20 89H80C84.9706 89 89 84.9706 89 80V60C89 55.0294 84.9706 51 80 51H54L42 40Z"
      />
    </svg>
  );
}
