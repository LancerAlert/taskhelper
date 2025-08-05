# TaskHelper Header & Footer 분리 파일

TaskHelper 프로젝트의 Thymeleaf 변환을 대비하여 header와 footer를 별도 파일로 분리했습니다.

## 📁 파일 구조

```
C:\programming\p1\
├── header.html          # 표준 Header Navigation
├── footer.html          # 표준 Footer
├── fragments.html       # Thymeleaf Fragment 템플릿
└── README-fragments.md  # 이 파일
```

## 🔧 현재 사용법 (정적 HTML)

### Header 적용
1. `header.html` 파일의 `<nav>` 섹션을 복사
2. 대상 HTML 파일의 기존 navigation 부분과 교체
3. **현재 페이지 하이라이트**: 해당 메뉴 링크에 `text-blue-600 font-semibold` 클래스 추가

### Footer 적용
1. `footer.html` 파일의 `<footer>` 섹션을 복사
2. 대상 HTML 파일의 기존 footer 부분과 교체

## 🚀 Thymeleaf 변환 시 사용법

### Header Fragment 사용
```html
<!DOCTYPE html>
<html lang="ja" xmlns:th="http://www.thymeleaf.org">
<head>
  <!-- ... -->
</head>
<body>
  <!-- Header Fragment 포함 -->
  <div th:replace="fragments :: header"></div>
  
  <!-- 메인 콘텐츠 -->
  <main class="pt-16">
    <!-- ... -->
  </main>
  
  <!-- Mobile Menu Script 포함 -->
  <div th:replace="fragments :: mobile-menu-script"></div>
</body>
</html>
```

### Footer Fragment 사용
```html
  <!-- Footer Fragment 포함 -->
  <div th:replace="fragments :: footer"></div>
</body>
</html>
```

## 📋 표준 Header 구조

### Desktop Menu (5개 메뉴)
- ホーム (index.html)
- 依頼一覧 (task-list.html)  
- 依頼投稿 (task-create.html)
- プロフィール (profile.html)
- マイタスク (my-tasks.html)

### Auth Buttons
- ログイン (login.html)
- 始める (register.html)

### Mobile Menu
- Desktop과 동일한 5개 메뉴
- 반응형 햄버거 메뉴
- 아이콘 전환 애니메이션

## 📋 표준 Footer 구조

### 4열 그리드 레이아웃
1. **브랜드 섹션**: 로고 + 서비스 설명
2. **서비스 섹션**: 카테고리별 링크 (category 파라미터 포함)
3. **서포트 섹션**: 헬프센터, 문의, 이용약관, 개인정보보호정책
4. **팔로우 섹션**: SNS 링크 (Twitter, Facebook, Instagram)

### 저작권 섹션
- 2025년 저작권 표시
- 접근성 개선 (lang 속성)

## 🔄 Thymeleaf 변환 시 추가 예정 기능

### Header
- **현재 페이지 하이라이트**: `th:classappend="${#httpServletRequest.requestURI == '/index' ? 'text-blue-600 font-semibold' : 'text-gray-700'}"`
- **인증 상태별 메뉴**: `th:if="${#authentication.authenticated}"` 조건부 렌더링
- **URL 생성**: `th:href="@{/task-list}"` 링크 표현식

### Footer
- **동적 링크**: `th:href="@{/task-list(category='shopping')}"` 파라미터 포함 링크
- **다국어 지원**: `th:text="#{footer.services}"` i18n 메시지

## 📝 주의사항

1. **현재 페이지 하이라이트**: 각 HTML 파일에서 수동으로 현재 페이지 메뉴에 활성 클래스 적용
2. **JavaScript 의존성**: Mobile menu 기능을 위한 JavaScript 코드 포함
3. **Font Awesome**: 아이콘 라이브러리 의존성 확인 필요
4. **Tailwind CSS**: 유틸리티 클래스 의존성 확인 필요

## 🔗 관련 파일들

이 fragment들은 다음 HTML 파일들에 이미 적용되어 있습니다:
- index.html
- login.html
- register.html
- task-create.html
- task-list.html
- task-detail.html
- profile.html
- my-tasks.html

## 🎯 변환 로드맵

1. **1단계**: 정적 HTML에서 fragment 파일 활용
2. **2단계**: Thymeleaf 템플릿 엔진 도입
3. **3단계**: Fragment 기반 동적 렌더링
4. **4단계**: 인증 시스템 통합
5. **5단계**: 다국어 지원 추가