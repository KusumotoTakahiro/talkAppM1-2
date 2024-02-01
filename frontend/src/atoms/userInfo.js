import { atom } from 'recoil'

export const userInfo = {
  session_token: atom(
    {
      key: 'sessionToken',
      default: '',
    }
  ),
  user_id: atom(
    {
      key: 'userId',
      default: 0,
    }
  ),
  now_thread: atom(
    {
      key: 'nowThread',
      default: '',
    }
  ),
}