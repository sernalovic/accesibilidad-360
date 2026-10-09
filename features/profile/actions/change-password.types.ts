export interface ChangePasswordActionSuccess {
  success: true;
}

export interface ChangePasswordActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<
    Record<"currentPassword" | "newPassword" | "confirmPassword", string[] | undefined>
  >;
}

export type ChangePasswordActionResult = ChangePasswordActionSuccess | ChangePasswordActionFailure;
