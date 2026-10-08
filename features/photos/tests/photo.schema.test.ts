import { describe, expect, it } from "vitest";
import { uploadPhotoSchema } from "@/features/photos/schemas/photo.schema";

function photoFile(name: string, type: string, size: number): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("uploadPhotoSchema (SPEC-050)", () => {
  it("acepta JPG, PNG y WebP dentro del límite", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      const result = uploadPhotoSchema.safeParse({
        establishmentId: "est-1",
        photo: photoFile("foto.jpg", type, 1024),
      });
      expect(result.success).toBe(true);
    }
  });

  it("rechaza formatos no permitidos", () => {
    const result = uploadPhotoSchema.safeParse({
      establishmentId: "est-1",
      photo: photoFile("foto.gif", "image/gif", 1024),
    });
    expect(result.success).toBe(false);
  });

  it("rechaza archivos mayores de 5 MB", () => {
    const result = uploadPhotoSchema.safeParse({
      establishmentId: "est-1",
      photo: photoFile("foto.jpg", "image/jpeg", 5 * 1024 * 1024 + 1),
    });
    expect(result.success).toBe(false);
  });

  it("rechaza archivos vacíos", () => {
    const result = uploadPhotoSchema.safeParse({
      establishmentId: "est-1",
      photo: photoFile("foto.jpg", "image/jpeg", 0),
    });
    expect(result.success).toBe(false);
  });
});
