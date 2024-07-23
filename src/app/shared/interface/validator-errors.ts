export enum ValidationErrKeys {
  Required = 'required',
  Invalid = 'invalid',
  Message = 'message',
  Country = 'country',
  Username = 'username',
  Birthday = 'birthday',
  Server = 'server',
}

export enum ValidationClasses {
  Valid = 'is-valid',
  Invalid = 'is-invalid',
}

export const ErrorMessages: { [key: string]: string } = {
  [ValidationErrKeys.Required]: 'This field is required',
  [ValidationErrKeys.Invalid]: 'Invalid field',
  [ValidationErrKeys.Country]: 'Please provide a correct Country',
  [ValidationErrKeys.Username]: 'Please provide a correct Username',
  [ValidationErrKeys.Birthday]: 'Please provide a correct Birthday',
  [ValidationErrKeys.Server]: 'Server error',
}
