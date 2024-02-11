import { atom } from 'recoil'
// recoilでkeyという名前のキーがあるが，単なるUIDみたいなもので使うことはない．
// 逆にobjectのスネーク記法のキー（session_tokenとか）は実際に識別する際に使う．
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
  // 現在使っているThreadをThreadIDで管理．
  now_thread: atom(
    {
      key: 'nowThread',
      default: '',
    }
  ),
  // 所持している全てのThreadをThreadIDで管理．
  own_threads: atom(
    {
      key: 'ownThreads',
      default: [],
    }
  )
}