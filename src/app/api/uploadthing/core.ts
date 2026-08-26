import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { ADMIN_COOKIE, isValidToken } from "@/lib/admin/auth";
import { getActor } from "@/lib/bookings/authz";

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
  documentUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    blob: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const actor = await getActor(req);
      if (!actor) throw new UploadThingError("Only authenticated agents and admins can upload booking documents.");
      return { actor: actor.label };
    })
    .onUploadComplete(({ file, metadata }) => ({
      url: file.url,
      key: file.key,
      name: file.name,
      uploadedBy: metadata.actor,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
