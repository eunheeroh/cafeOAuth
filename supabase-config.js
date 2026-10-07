// ==========================================================
// Supabase 공통 설정 (index.html, login.html 에서 함께 사용)
// ==========================================================
// Supabase 프로젝트의 Project URL과 anon public key
const SUPABASE_URL = "https://wlywjxklcwcdnkseudzu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseXdqeGtsY3djZG5rc2V1ZHp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NzA3MjQsImV4cCI6MjEwNjE0NjcyNH0.0h3sT-uP4Axqk7Yxf0YzcxXogWC_acg2_6q4TwGS53Y";

// Supabase 클라이언트 객체 생성 (변수명: supabaseClient)
// CDN으로 불러온 window.supabase 라이브러리의 createClient 함수를 사용합니다.
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
