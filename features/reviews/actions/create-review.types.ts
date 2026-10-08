export interface CreateReviewActionSuccess {
  success: true;
  id: string;
}

export interface CreateReviewActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<Record<"comment" | "scores", string[] | undefined>>;
}

export type CreateReviewActionResult = CreateReviewActionSuccess | CreateReviewActionFailure;
