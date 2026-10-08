export interface UpdateEstablishmentActionSuccess {
  success: true;
  id: string;
}

export interface UpdateEstablishmentActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<
    Record<
      "name" | "categoryId" | "address" | "provinceId" | "municipalityId" | "description",
      string[] | undefined
    >
  >;
}

export type UpdateEstablishmentActionResult =
  UpdateEstablishmentActionSuccess | UpdateEstablishmentActionFailure;
