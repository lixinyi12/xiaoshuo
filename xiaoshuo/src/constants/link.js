const HOME_PATH = '/';
const CATEGORY_PATH = '/Category';
const PERSON_PATH = '/Person';
const SIGNIN_PATH = '/SignIn';
const SIGNUP_PATH = '/SignUp';
const RANGKING_LIST_PATH = '/RangkingList';
const RESET_PASSWORD_PATH = '/ResetPassword';
const COMMENT_HISTORY_PATH = '/CommentHistory';
const NOVEL_READ_PATH = '/NovelRead';
const BOOK_SHELF_PATH = '/BookShelf';
const PUBLISH_PATH = '/Publish';
const MULU_PATH = '/Mulu';
const FOLLOW_FAN_PATH = '/FollowFan';
const WORKS_PATH = '/Works';
const PERSONAL_INFO_PATH = '/PersonalInfo';

// 带参数的路由路径生成函数
export const getNovelReadPath = (novel_id, chapter_id) =>
  `${NOVEL_READ_PATH}?novelId=${novel_id}&chapterNumber=${chapter_id}`;
export const getMuluPath = (id) => `${MULU_PATH}?id=${id}`;

export const ROUTES = {
  HOME: HOME_PATH,
  CATEGORY: CATEGORY_PATH,
  PERSON: PERSON_PATH,
  SIGNIN: SIGNIN_PATH,
  SIGNUP: SIGNUP_PATH,
  RANGKING_LIST: RANGKING_LIST_PATH,
  RESET_PASSWORD: RESET_PASSWORD_PATH,
  COMMENT_HISTORY: COMMENT_HISTORY_PATH,
  NOVEL_READ: NOVEL_READ_PATH,
  BOOK_SHELF: BOOK_SHELF_PATH,
  PUBLISH: PUBLISH_PATH,
  MULU: MULU_PATH,
  FOLLOW_FAN: FOLLOW_FAN_PATH,
  WORKS: WORKS_PATH,
  PERSONAL_INFO: PERSONAL_INFO_PATH
};