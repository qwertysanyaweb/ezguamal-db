export interface User {
  'ID': number,
  'user_login': string,
  'user_email': string,
  'display_name': string,
  'roles_name': string,
  'roles': any
}

export interface UserAuthorization {
  'wp_user': {
    'data': {
      'ID': number,
      'user_login': string,
      'user_email': string,
      'display_name': string
    },
    'ID': 1,
    'roles_name': string,
    'allcaps': any[]
  },
  'access_token': string,
  'expires_in': number,
  'refresh_token': string,
}


export interface token {
  'access_token': string,
  'expires_in': number
}
