import { createStore, Store } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createWrapper, Context, HYDRATE } from "next-redux-wrapper";

// 초기 상태
const initialState = {
  tokens: {},
  user: {},
  tokenExpiresAt: {
    accessToken: 0,
    refreshToken: 0,
  },
  isAdmin: false,
  loginState: {},
};

// 리듀서
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_TOKENS":
      return {
        ...state,
        tokens: action.payload,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_ACCESSTOKEN_EXPIRESAT":
      return {
        ...state,
        tokenExpiresAt: {
          ...state.tokenExpiresAt,
          accessToken: action.payload,
        },
      };
    case "SET_REFRESHTOKEN_EXPIRESAT":
      return {
        ...state,
        tokenExpiresAt: {
          ...state.tokenExpiresAt,
          refreshToken: action.payload,
        },
      };
    case "SET_ISADMIN":
      return {
        ...state,
        isAdmin: action.payload,
      };
    case "SET_LOGINSTATE":
      return {
        ...state,
        loginState: action.payload,
      };
    // 다른 액션 추가 가능
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

// 스토어 생성
const store = createStore(persistedReducer);

const persistor = persistStore(store);

export { persistor, store };

const makeStore = (context: Context) => createStore(persistedReducer);
export const wrapper = createWrapper<Store<any>>(makeStore, {
  debug: true,
});
