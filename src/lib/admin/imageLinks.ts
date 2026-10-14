import { isImagePageLink } from "@/lib/imageHosts";
import { uploadFiles } from "@/lib/uploadthing";

/** Returns an error message for an unusable image link, or "" when it looks fine. */
export function imageLinkProblem(url: string): string {
  const value = url.trim();
  if (!value) return "";
  if (value.startsWith("/") && !value.startsWith("//") && !/\s/.test(value)) return "";
  if (!/^https:\/\/\S+$/i.test(value)) return "The link must start with https:// and contain no spaces.";
  if (isImagePageLink(value)) {
    return "This is a link to a web page, not the image itself. Upload the photo instead, or right-click the image and choose “Copy image address”.";
  }
  return "";
}

/** Uploads images to UploadThing (admin session required) and returns their public URLs. */
export async function uploadImages(files: FileList | File[] | null, limit = 10): Promise<string[]> {
  const list = Array.from(files || []).slice(0, limit);
  if (!list.length) return [];
  const result = await uploadFiles("imageUploader", { files: list });
  return result.map((file) => file.ufsUrl);
}
