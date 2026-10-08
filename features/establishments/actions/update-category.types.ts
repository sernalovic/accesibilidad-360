export interface UpdateCategoryActionSuccess {
  success: true;
  id: string;
}

export interface UpdateCategoryActionFailure {
  success: false;
  message: string;
}

export type UpdateCategoryActionResult = UpdateCategoryActionSuccess | UpdateCategoryActionFailure;
