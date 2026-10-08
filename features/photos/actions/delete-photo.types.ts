export interface DeletePhotoActionSuccess {
  success: true;
}

export interface DeletePhotoActionFailure {
  success: false;
  message: string;
}

export type DeletePhotoActionResult = DeletePhotoActionSuccess | DeletePhotoActionFailure;
