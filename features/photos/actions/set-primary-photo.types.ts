export interface SetPrimaryPhotoActionSuccess {
  success: true;
}

export interface SetPrimaryPhotoActionFailure {
  success: false;
  message: string;
}

export type SetPrimaryPhotoActionResult =
  SetPrimaryPhotoActionSuccess | SetPrimaryPhotoActionFailure;
