// ==========================================================
// 로그인 페이지 (Google 로그인)
// ==========================================================
// supabaseClient 는 supabase-config.js 에서 만들어집니다.

const googleLoginBtn = document.getElementById("googleLoginBtn"); // 구글 로그인 버튼
const loginMessage = document.getElementById("loginMessage");     // 안내/오류 메시지 영역

// 로그인 후 돌아올 주소 (같은 폴더의 index.html)
const REDIRECT_URL = new URL("index.html", window.location.href).href;


// (1) 이미 로그인되어 있다면 바로 주문 페이지로 이동
async function checkAlreadyLoggedIn() {
  if (!supabaseClient) {
    loginMessage.textContent = "Supabase 연결에 실패했어요. 인터넷 연결을 확인해주세요.";
    googleLoginBtn.disabled = true;
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = REDIRECT_URL;
  }
}


// (2) 이메일 + 비밀번호 로그인 (회원가입 페이지에서 가입한 계정)
const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const emailLoginBtn = document.getElementById("emailLoginBtn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // 기본 새로고침 방지

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  if (!email || !password) {
    alert("이메일과 비밀번호를 입력해주세요");
    return;
  }

  emailLoginBtn.disabled = true;
  emailLoginBtn.textContent = "로그인 중...";

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  emailLoginBtn.disabled = false;
  emailLoginBtn.textContent = "로그인";

  if (error) {
    console.error("이메일 로그인 실패:", error);
    // 자주 나오는 오류는 한글로 안내
    if (error.message.includes("Invalid login credentials")) {
      loginMessage.textContent = "이메일 또는 비밀번호가 맞지 않아요.";
    } else if (error.message.includes("Email not confirmed")) {
      loginMessage.textContent = "메일함에서 인증 링크를 먼저 눌러주세요.";
    } else {
      loginMessage.textContent = `로그인에 실패했어요 (원인: ${error.message})`;
    }
    return;
  }

  window.location.href = REDIRECT_URL;
});


// (3) 구글 로그인 버튼 클릭 → 구글 로그인 창으로 이동
googleLoginBtn.addEventListener("click", async () => {
  googleLoginBtn.disabled = true;
  loginMessage.textContent = "구글 로그인 페이지로 이동 중...";

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: REDIRECT_URL, // 로그인이 끝나면 주문 페이지로 돌아옴
    },
  });

  if (error) {
    console.error("구글 로그인 실패:", error);
    loginMessage.textContent = `로그인에 실패했어요 (원인: ${error.message})`;
    googleLoginBtn.disabled = false;
  }
});


checkAlreadyLoggedIn();
