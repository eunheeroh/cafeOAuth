// ==========================================================
// 회원가입 페이지 (이메일 회원가입 + Google 가입)
// ==========================================================
// supabaseClient 는 supabase-config.js 에서 만들어집니다.

const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const signupNameInput = document.getElementById("signupName");
const signupEmailInput = document.getElementById("signupEmail");
const signupPasswordInput = document.getElementById("signupPassword");
const signupPasswordConfirmInput = document.getElementById("signupPasswordConfirm");
const googleSignupBtn = document.getElementById("googleSignupBtn");
const signupMessage = document.getElementById("signupMessage");

// 가입/로그인 후 돌아올 주소 (같은 폴더의 index.html)
const REDIRECT_URL = new URL("index.html", window.location.href).href;


// (1) 이미 로그인되어 있다면 바로 주문 페이지로 이동
async function checkAlreadyLoggedIn() {
  if (!supabaseClient) {
    signupMessage.textContent = "Supabase 연결에 실패했어요. 인터넷 연결을 확인해주세요.";
    signupBtn.disabled = true;
    googleSignupBtn.disabled = true;
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = REDIRECT_URL;
  }
}


// (2) 이메일 회원가입
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // 기본 새로고침 방지

  const name = signupNameInput.value.trim();
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;
  const passwordConfirm = signupPasswordConfirmInput.value;

  // 입력값 검증
  if (!name) {
    alert("이름을 입력해주세요");
    signupNameInput.focus();
    return;
  }
  if (!email || !email.includes("@")) {
    alert("올바른 이메일을 입력해주세요");
    signupEmailInput.focus();
    return;
  }
  if (password.length < 6) {
    alert("비밀번호는 6자 이상이어야 해요");
    signupPasswordInput.focus();
    return;
  }
  if (password !== passwordConfirm) {
    alert("비밀번호가 서로 달라요");
    signupPasswordConfirmInput.focus();
    return;
  }

  // 버튼 비활성화 (두 번 눌리지 않도록 방지)
  signupBtn.disabled = true;
  signupBtn.textContent = "가입 중...";

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { full_name: name },   // 이름은 사용자 정보(user_metadata)에 저장
      emailRedirectTo: REDIRECT_URL, // 인증 메일 링크를 누르면 주문 페이지로 이동
    },
  });

  signupBtn.disabled = false;
  signupBtn.textContent = "회원가입";

  if (error) {
    console.error("회원가입 실패:", error);
    // 자주 나오는 오류는 한글로 안내
    if (error.message.includes("signups are disabled")) {
      signupMessage.textContent = "지금은 이메일 회원가입이 꺼져 있어요. (관리자: Supabase에서 Email 가입을 켜주세요)";
    } else if (error.message.includes("already registered")) {
      signupMessage.textContent = "이미 가입된 이메일이에요. 로그인해주세요.";
    } else {
      signupMessage.textContent = `회원가입에 실패했어요 (원인: ${error.message})`;
    }
    return;
  }

  if (data.session) {
    // 이메일 인증을 끈 경우: 바로 로그인 상태가 되므로 주문 페이지로 이동
    alert(`${name}님, 가입을 환영해요! ☕`);
    window.location.href = REDIRECT_URL;
  } else {
    // 이메일 인증을 켠 경우(Supabase 기본값): 메일함 확인 안내
    signupForm.reset();
    signupMessage.textContent = `📧 ${email} 으로 인증 메일을 보냈어요. 메일의 링크를 누르면 가입이 완료됩니다.`;
  }
});


// (3) 구글로 가입 (처음 로그인하면 자동으로 회원이 됩니다)
googleSignupBtn.addEventListener("click", async () => {
  googleSignupBtn.disabled = true;
  signupMessage.textContent = "구글 로그인 페이지로 이동 중...";

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: REDIRECT_URL },
  });

  if (error) {
    console.error("구글 가입 실패:", error);
    signupMessage.textContent = `구글 가입에 실패했어요 (원인: ${error.message})`;
    googleSignupBtn.disabled = false;
  }
});


checkAlreadyLoggedIn();
