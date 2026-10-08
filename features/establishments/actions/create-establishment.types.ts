export interface CreateEstablishmentActionSuccess {
  success: true;
  id: string;
}

export interface CreateEstablishmentActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<
    Record<
      "name" | "categoryId" | "address" | "provinceId" | "municipalityId" | "description",
      string[] | undefined
    >
  >;
}

export type CreateEstablishmentActionResult =
  CreateEstablishmentActionSuccess | CreateEstablishmentActionFailure;
