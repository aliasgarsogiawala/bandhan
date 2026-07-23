import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { ADMIN_COOKIE, isValidToken } from "@/lib/admin/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 10,
    },
  })
    .middleware(({ req }) => {
      if (!isValidToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        throw new UploadThingError("Only authenticated admins can upload media.");
      }
      return {};
    })
    .onUploadComplete(({ file }) => ({
      url: file.url,
      key: file.key,
      name: file.name,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
