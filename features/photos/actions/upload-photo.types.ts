export interface UploadPhotoState {
  success: boolean;
  message: string | null;
}

export const initialUploadPhotoState: UploadPhotoState = { success: false, message: null };
