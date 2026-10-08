export interface DeleteEstablishmentActionSuccess {
  success: true;
}

export interface DeleteEstablishmentActionFailure {
  success: false;
  message: string;
}

export type DeleteEstablishmentActionResult =
  DeleteEstablishmentActionSuccess | DeleteEstablishmentActionFailure;
