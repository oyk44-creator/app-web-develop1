# 이메일 템플릿

퓨처모빌리티AI - Supabase Magic Link 이메일 템플릿

## 📁 파일 구조

```
emails/
├── README.md                    # 이 파일
├── magic-link-full.html        # 풀 버전 (브랜딩, 보안 안내 포함)
├── magic-link-minimal.html     # 미니멀 버전 (간결한 디자인)
└── magic-link-simple.html      # 심플 버전 (기본형)
```

## 🚀 Supabase 대시보드에 적용하기

### 1. Supabase 대시보드 접속

```
https://supabase.com/dashboard/project/vnqffhzjlxlkomytykah
```

### 2. Email Templates 메뉴로 이동

```
좌측 메뉴: Authentication → Email Templates
```

### 3. Magic Link 템플릿 선택

```
템플릿 목록에서 "Magic Link" 클릭
```

### 4. 템플릿 복사 & 붙여넣기

**Subject (제목) 부분**:

```
<!-- Subject --> 다음 줄의 내용을 복사하여 "Subject" 필드에 붙여넣기
```

**Body (본문) 부분**:

```
<!-- Body --> 다음부터 파일 끝까지 전체 HTML을 복사하여 "Message (Body)" 필드에 붙여넣기
```

### 5. 저장 및 테스트

```
1. "Save" 버튼 클릭
2. 실제 이메일 주소로 로그인 테스트
3. 수신된 이메일 확인
```

## 📋 템플릿 버전 비교

| 버전        | 파일명                    | 특징                                    | 추천 용도        |
| ----------- | ------------------------- | --------------------------------------- | ---------------- |
| **Full**    | `magic-link-full.html`    | 완전한 브랜딩, 보안 안내, 반응형 디자인 | 프로덕션 환경    |
| **Minimal** | `magic-link-minimal.html` | 간결한 디자인, 핵심 요소만 포함         | 일반적인 사용    |
| **Simple**  | `magic-link-simple.html`  | 최소한의 스타일, 빠른 로딩              | 개발/테스트 환경 |

## 🎨 템플릿 커스터마이징

### 사용 가능한 Supabase 변수

```handlebars
{{ .ConfirmationURL }}    # Magic Link URL (필수)
{{ .Email }}               # 사용자 이메일
{{ .Token }}               # 인증 토큰
{{ .TokenHash }}           # 토큰 해시
{{ .SiteURL }}             # 사이트 URL
{{ .RedirectTo }}          # 리다이렉션 URL
```

### 브랜드 컬러 변경

현재 설정된 컬러 (`lib/theme.ts` 기준):

```css
/* Primary Color */
background-color: #3b82f6; /* 파란색 */

/* Secondary Color */
background-color: #8b5cf6; /* 보라색 */

/* Gradient */
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
```

컬러를 변경하려면 HTML 파일에서 해당 색상 코드를 찾아 수정하세요.

### 로고 추가

헤더에 로고 이미지를 추가하려면:

```html
<div class="header">
  <!-- 로고 추가 -->
  <img
    src="https://yourdomain.com/logo.png"
    alt="로고"
    style="max-width: 200px; margin-bottom: 16px;"
  />
  <h1>🚗 퓨처모빌리티AI</h1>
</div>
```

**주의**: 이미지는 반드시 공개 URL이어야 합니다. (이메일에서는 상대 경로 불가)

## 🔧 테스트 방법

### 1. 로컬에서 미리보기

HTML 파일을 브라우저에서 직접 열어 디자인 확인:

```bash
# 파일 탐색기에서 HTML 파일을 더블클릭하거나
# 브라우저 주소창에 파일 경로 입력
file:///C:/python/mvp-web-supabase-next/frontend/emails/magic-link-full.html
```

### 2. 실제 이메일 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
# 자신의 이메일 주소로 로그인 시도
# 받은 이메일 확인
```

### 3. Supabase 로그 확인

```
Authentication → Logs
→ 발송된 이메일 확인 가능
```

## 📱 모바일 최적화

모든 템플릿은 반응형 디자인이 적용되어 있습니다:

```css
@media only screen and (max-width: 600px) {
  /* 모바일 환경에서 자동 조정 */
  .button {
    display: block;
    width: 100%;
  }
}
```

## ⚠️ 주의사항

### 이메일 클라이언트 제약사항

```
❌ JavaScript 사용 불가
❌ 외부 CSS 파일 불가
❌ 복잡한 CSS 속성 제한적
✅ 인라인 스타일만 사용
✅ 기본 HTML 태그 사용
✅ 테이블 레이아웃 (구형 클라이언트 호환)
```

### 스팸 필터 회피

```
❌ 과도한 이미지 사용
❌ 대문자 과다 사용
❌ "무료", "당첨" 등 스팸 키워드
✅ 텍스트와 이미지 균형
✅ 명확한 발신자 정보
✅ 수신 거부 링크 (선택사항)
```

## 🔐 보안 권장사항

### 템플릿에 포함된 보안 안내

1. **링크 유효 시간 명시**: "1시간 동안 유효"
2. **미요청 시 대응**: "로그인을 요청하지 않으셨다면 무시하세요"
3. **공유 금지**: "링크를 다른 사람과 공유하지 마세요"

### 추가 보안 강화

Supabase 대시보드에서:

```
Authentication → Settings

✅ Enable email confirmations
✅ Secure email change
✅ Email rate limiting
```

## 📞 문의

템플릿 관련 문의사항이 있으시면:

- **이메일**: phs@trenet.kr
- **프로젝트**: 퓨처모빌리티AI

## 📝 변경 이력

| 날짜       | 버전  | 변경 내용                                |
| ---------- | ----- | ---------------------------------------- |
| 2024-11-07 | 1.0.0 | 초기 템플릿 생성 (Full, Minimal, Simple) |

---

**최종 업데이트**: 2024-11-07
**버전**: 1.0.0
