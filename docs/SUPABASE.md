[How to Run Supabase Project Locally with Supabase CLI and Docker | Step-by-Step Guide](https://youtu.be/i1STOfZ-_R0?si=P3D0MvJ2xknoUa0z)

`supabase init` 명령어는 로컬에 Supabase 프로젝트 폴더(`supabase/`)를 생성하지만, 이 폴더는 **빈 상태**이며, 원격 프로젝트의 정보는 포함되어 있지 않습니다. 따라서 `supabase start`를 실행하면 이 빈 폴더를 기반으로 완전히 새로운 로컬 데이터베이스를 실행하게 되므로, Supabase Studio에서 스키마가 비어 있는 것처럼 보이는 것입니다.

기존 클라우드 프로젝트의 스키마를 로컬로 가져와서 개발하려면 \*\*`link`\*\*와 **`db pull`** 명령어를 사용하여 동기화해야 합니다.

---

## ✅ 기존 프로젝트 연결 및 스키마 가져오기 단계

다음 단계를 순서대로 진행하여 클라우드 프로젝트의 스키마를 로컬 환경에 가져오세요.

### 1단계: 로컬 서비스 중지 (Stop)

현재 실행 중인 로컬 Supabase 서비스를 먼저 중지합니다.

```bash
supabase stop
```

### 2단계: 프로젝트 참조 ID 확인 (Project Reference ID)

원격 Supabase 프로젝트를 식별하기 위한 \*\*참조 ID(Reference ID)\*\*를 찾아야 합니다.

- Supabase 대시보드에서 해당 프로젝트로 이동합니다.
- **"Settings"** (톱니바퀴 아이콘) \> \*\*"General Settings"\*\*로 이동합니다.
- "Project ID" 또는 "Reference ID" 섹션에서 `********-****-****-****-************` 형태의 ID를 복사합니다.

### 3단계: 로컬 프로젝트 연결 (Link)

CLI를 사용하여 로컬 프로젝트를 원격 프로젝트에 연결합니다.

```bash
supabase link --project-ref <복사한_프로젝트_참조_ID>
```

- 이 명령어를 실행하면 **Database Password**를 입력하라는 메시지가 표시될 수 있습니다. (Supabase 대시보드 \> Settings \> Database \> Database Password)

### 4단계: 스키마 정보 가져오기 (DB Pull)

원격 데이터베이스의 현재 스키마를 로컬의 마이그레이션 파일로 가져옵니다.

```bash
supabase db pull
```

- 이 명령어는 원격 데이터베이스의 스키마(테이블, 함수, 정책 등)를 분석하여 로컬 `supabase/migrations` 폴더에 타임스탬프가 붙은 초기 SQL 파일로 저장합니다. 이 파일이 로컬 DB의 초기 스키마를 정의하게 됩니다.

### 5단계: 로컬 서비스 재실행 (Start)

이제 연결된 스키마를 기반으로 로컬 서비스를 다시 시작합니다.

```bash
supabase start
```

이후 로컬 Supabase Studio 주소 (`http://localhost:54323`)에 다시 접속하여 **Table Editor**나 **Database** 섹션을 확인하면, 클라우드 프로젝트와 **동일한 스키마 구조**가 로컬에 적용된 것을 볼 수 있습니다. (데이터는 제외하고 스키마만 가져옵니다.)
