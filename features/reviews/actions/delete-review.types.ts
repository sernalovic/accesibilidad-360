export interface DeleteReviewActionSuccess {
  success: true;
}

export interface DeleteReviewActionFailure {
  success: false;
  message: string;
}

export type DeleteReviewActionResult = DeleteReviewActionSuccess | DeleteReviewActionFailure;
