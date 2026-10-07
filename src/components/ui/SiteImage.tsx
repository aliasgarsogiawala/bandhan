import Image, { type ImageProps } from "next/image";
import { canOptimizeImage } from "@/lib/imageHosts";

/**
 * Drop-in replacement for `next/image`. Images on hosts the optimizer doesn't
 * know (links pasted into the admin Image Manager) are rendered `unoptimized`
 * — loaded directly from their host — instead of crashing the page.
 */
export default function SiteImage({ src, alt, unoptimized, ...props }: ImageProps) {
  const remoteUnknown = typeof src === "string" && !canOptimizeImage(src);
  return <Image src={src} alt={alt} unoptimized={unoptimized || remoteUnknown} {...props} />;
}
