export interface RegisterActionSuccess {
  success: true;
}

export interface RegisterActionFailure {
  success: false;
  message: string;
  fieldErrors?: Partial<
    Record<"name" | "email" | "password" | "confirmPassword", string[] | undefined>
  >;
}

export type RegisterActionResult = RegisterActionSuccess | RegisterActionFailure;
