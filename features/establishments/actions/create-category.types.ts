export interface CreateCategoryActionSuccess {
  success: true;
  id: string;
}

export interface CreateCategoryActionFailure {
  success: false;
  message: string;
}

export type CreateCategoryActionResult = CreateCategoryActionSuccess | CreateCategoryActionFailure;
