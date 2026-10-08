import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { getDashboardData } from "@/features/dashboard/services/dashboard.service";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    establishment: { findMany: vi.fn(), count: vi.fn() },
    user: { count: vi.fn() },
    accessibilityReview: { findMany: vi.fn(), count: vi.fn() },
    photo: { count: vi.fn() },
  },
}));

const countEstablishments = vi.mocked(prisma.establishment.count);
const countUsers = vi.mocked(prisma.user.count);
const countReviews = vi.mocked(prisma.accessibilityReview.count);
const countPhotos = vi.mocked(prisma.photo.count);
const findEstablishments = vi.mocked(prisma.establishment.findMany);
const findReviews = vi.mocked(prisma.accessibilityReview.findMany);

beforeEach(() => {
  vi.clearAllMocks();
});

function establishmentRow(name: string, createdAt: string, scores: number[] = []) {
  return {
    id: `est-${name}`,
    name,
    createdAt: new Date(createdAt),
    category: { name: "Restaurante" },
    municipality: { name: "Madrid" },
    province: { name: "Madrid" },
    photos: [],
    reviews: scores.length > 0 ? [{ scores: scores.map((score) => ({ score })) }] : [],
  };
}

function mockDatabase(): void {
  countEstablishments.mockResolvedValue(6);
  countUsers.mockResolvedValue(3);
  countReviews.mockResolvedValue(4);
  countPhotos.mockResolvedValue(2);
  findEstablishments.mockResolvedValue([
    establishmentRow("F", "2026-06-01", [5, 5]),
    establishmentRow("E", "2026-05-01", [4]),
    establishmentRow("D", "2026-04-01", [4]),
    establishmentRow("C", "2026-03-01", [3, 3]),
    establishmentRow("B", "2026-02-01"),
    establishmentRow("A", "2026-01-01", [5]),
  ]);
  findReviews.mockResolvedValue([
    {
      id: "rev-1",
      comment: "Genial",
      createdAt: new Date("2026-06-01"),
      user: { name: "María" },
      establishment: { id: "est-F", name: "F" },
      scores: [{ score: 5, criterion: { name: "Acceso" } }],
    },
  ]);
}

describe("getDashboardData (SPEC-100)", () => {
  it("compone estadísticas, últimos, top y valoraciones en paralelo", async () => {
    mockDatabase();

    const data = await getDashboardData();

    expect(data.stats).toEqual({ establishments: 6, users: 3, reviews: 4, photos: 2 });
    expect(data.latest.map((item) => item.name)).toEqual(["F", "E", "D", "C", "B"]);
    expect(data.topRated.map((item) => item.name)).toEqual(["F", "A", "E", "D", "C"]);
    expect(data.latestReviews).toEqual([
      expect.objectContaining({
        id: "rev-1",
        establishmentName: "F",
        userName: "María",
        averageScore: 5,
      }),
    ]);
    expect(countEstablishments).toHaveBeenCalledOnce();
    expect(findEstablishments).toHaveBeenCalledOnce();
    expect(findReviews).toHaveBeenCalledOnce();
  });

  it("resuelve vacíos sin errores", async () => {
    countEstablishments.mockResolvedValue(0);
    countUsers.mockResolvedValue(0);
    countReviews.mockResolvedValue(0);
    countPhotos.mockResolvedValue(0);
    findEstablishments.mockResolvedValue([]);
    findReviews.mockResolvedValue([]);

    const data = await getDashboardData();

    expect(data).toEqual({
      stats: { establishments: 0, users: 0, reviews: 0, photos: 0 },
      latest: [],
      topRated: [],
      latestReviews: [],
    });
  });
});
