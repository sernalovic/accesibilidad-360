export interface UpdateNameActionSuccess {
  success: true;
  name: string;
}

export interface UpdateNameActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<Record<"name", string[] | undefined>>;
}

export type UpdateNameActionResult = UpdateNameActionSuccess | UpdateNameActionFailure;
