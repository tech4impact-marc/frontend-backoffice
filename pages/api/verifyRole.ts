import { store } from "@/redux/store";

export default function verifyRole() {
  const state = store.getState();
  if (!state.isAdmin) {
    alert("관리자로 인증된 계정만 이용할 수 있습니다.");
    return false;
  } else {
    return true;
  }
}
