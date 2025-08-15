# TaskHelper 🏠

**信頼できる近所の代行サービス**

TaskHelper는 일본 지역사회를 위한 이웃 간 업무 대행 서비스 플랫폼입니다. 사용자들이 쇼핑, 청소, 배달, 반려동물 돌봄, 수리 등의 업무를 요청하고, 헬퍼들이 이러한 업무를 맡아 수행할 수 있는 안전하고 신뢰할 수 있는 커뮤니티 서비스입니다.

## ✨ 주요 기능

### 🎯 업무 카테고리
- **🛒 쇼핑 대행** - 슈퍼마켓, 편의점 쇼핑
- **🧹 청소 서비스** - 집 정리, 청소
- **🚚 배달 서비스** - 물품 배송, 운반
- **🐕 반려동물 케어** - 산책, 돌봄 서비스
- **🔧 수리 서비스** - 간단한 집안 수리

### 👥 사용자 유형
- **일반 사용자**: 업무 요청 및 관리
- **헬퍼**: 업무 수행 및 수익 창출
- **관리자**: 플랫폼 관리 및 분쟁 해결

### 💡 핵심 기능
- 실시간 업무 매칭 시스템
- 안전한 결제 시스템
- 평점 및 리뷰 시스템
- 분쟁 해결 센터
- 모바일 반응형 디자인
- 일본어 완전 지원

## 🛠 기술 스택

### 백엔드
- **Spring Boot 3.5.4** - 웹 프레임워크
- **Spring Security** - 인증 및 보안
- **Spring Data JPA** - 데이터베이스 추상화
- **MyBatis** - SQL 매핑
- **H2 Database** - 개발용 인메모리 DB
- **MySQL** - 프로덕션 데이터베이스

### 프론트엔드
- **Thymeleaf** - 서버사이드 템플릿 엔진
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Alpine.js** - 경량 JavaScript 프레임워크
- **Font Awesome** - 아이콘 라이브러리
- **Toastr** - 알림 시스템
- **SweetAlert2** - 모달 및 확인 대화상자

## 🚀 시작하기

### 전제 조건
- Java 17 이상
- Gradle 7.0 이상
- MySQL 8.0 이상 (프로덕션 환경)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/taskhelper.git
   cd taskhelper
   ```

2. **의존성 설치 및 빌드**
   ```bash
   # Windows
   gradlew build
   
   # Unix/Mac
   ./gradlew build
   ```

3. **애플리케이션 실행**
   ```bash
   # Windows
   gradlew bootRun
   
   # Unix/Mac
   ./gradlew bootRun
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:8081
   ```

### 개발 환경 설정

**데이터베이스 설정**
- 개발 환경에서는 H2 인메모리 데이터베이스를 사용합니다
- 프로덕션 환경에서는 `application.yml`에서 MySQL 설정을 구성하세요

**보안 설정**
- 현재 개발 단계에서는 Spring Security가 비활성화되어 있습니다
- 프로덕션 배포 전에 `SecurityConfig.java`에서 적절한 보안 설정을 구성하세요

## 📁 프로젝트 구조

```
src/
├── main/
│   ├── java/com/taskhelper/
│   │   ├── TaskhelperApplication.java      # 메인 애플리케이션
│   │   ├── config/
│   │   │   └── SecurityConfig.java         # 보안 설정
│   │   └── controller/
│   │       └── MainController.java         # 메인 컨트롤러
│   └── resources/
│       ├── application.yml                 # 애플리케이션 설정
│       └── templates/                      # Thymeleaf 템플릿
│           ├── index.html                  # 메인 페이지
│           ├── layouts/                    # 레이아웃 템플릿
│           ├── fragments/                  # 재사용 가능한 컴포넌트
│           ├── tasks/                      # 업무 관련 페이지
│           ├── user/                       # 사용자 관리
│           ├── auth/                       # 인증 관련
│           ├── helper/                     # 헬퍼 기능
│           ├── admin/                      # 관리자 패널
│           ├── support/                    # 지원 페이지
│           └── misc/                       # 기타 유틸리티
└── test/
    └── java/com/taskhelper/
        └── TaskhelperApplicationTests.java # 테스트
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue (#2563eb)
- **카테고리별 색상**:
  - 쇼핑: Green
  - 청소: Blue
  - 배달: Orange
  - 반려동물: Purple
  - 수리: Red

### 반응형 디자인
- 모바일 우선 접근 방식
- Tailwind CSS 브레이크포인트 사용
- 접근성 고려 설계

## 🧪 테스트

```bash
# 모든 테스트 실행
gradlew test

# 특정 테스트 클래스 실행
gradlew test --tests "TaskhelperApplicationTests"
```

## 📊 개발 도구

```bash
# 빌드 아티팩트 정리
gradlew clean

# 사용 가능한 Gradle 태스크 확인
gradlew task

# 개발 서버 실행 (자동 재로드)
gradlew bootRun
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인
- 일본어 UI 텍스트 유지
- Tailwind CSS 유틸리티 클래스 우선 사용
- 모바일 반응형 디자인 고려
- 접근성 표준 준수

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 있거나 질문이 있으시면 [Issues](https://github.com/your-username/taskhelper/issues)를 통해 알려주세요.

## 🗺 로드맵

- [ ] 실시간 채팅 시스템
- [ ] 결제 시스템 통합
- [ ] 모바일 앱 개발
- [ ] GPS 기반 위치 서비스
- [ ] 다국어 지원 확장

---

**TaskHelper** - 믿을 수 있는 이웃과 함께하는 안전한 대행 서비스 ✨