export interface DeleteCategoryActionSuccess {
  success: true;
}

export interface DeleteCategoryActionFailure {
  success: false;
  message: string;
}

export type DeleteCategoryActionResult = DeleteCategoryActionSuccess | DeleteCategoryActionFailure;
