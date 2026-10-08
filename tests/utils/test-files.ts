// Utilidades para tests con archivos (jsdom).
// El File de jsdom no implementa arrayBuffer(); se añade un stub
// con bytes reales para que el código bajo test funcione igual
// que en navegadores y Node. Solo para tests, nunca en producción.
export function testImageFile(name = "foto.jpg", type = "image/jpeg", size = 1024): File {
  const file = new File([new Uint8Array(size)], name, { type });
  Object.defineProperty(file, "arrayBuffer", {
    value: async () => new Uint8Array(size).buffer,
  });
  return file;
}
