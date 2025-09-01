enum EDayOfWeek {
  Monday = '1, Start of the workweek',
  Tuesday = '2, Second day of work',
  Wednesday = '3, Midweek',
  Thursday = '4, Almost there',
  Friday = '5, Last workday',
  Saturday = '6, Weekend!',
  Sunday = '7, Rest day',
}

enum ETypeSendEmail {
  Activation = 'activation',
  ForgotPassword = 'forgotPassword',
  SuccessActivation = 'successActivation',
}

enum ETypeSetNewPassword {
  ForgotPassword = 'forgotPassword',
  Activation = 'activation',
}

enum EStatusPlaylist {
  Queued = 'queued',
  Playing = 'playing',
  Played = 'played',
  Stopped = 'stopped',
}

export {EDayOfWeek, ETypeSendEmail, ETypeSetNewPassword, EStatusPlaylist};
