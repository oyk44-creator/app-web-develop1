# API 문서

EV Battery Data Platform REST API 레퍼런스 문서입니다.

## 목차

- [개요](#개요)
- [인증](#인증)
- [공통 응답 형식](#공통-응답-형식)
- [에러 코드](#에러-코드)
- [API 엔드포인트](#api-엔드포인트)
  - [인증 API](#인증-api)
  - [데이터 API](#데이터-api)
  - [업로드 API](#업로드-api)
  - [차트 API](#차트-api)
  - [관리자 API](#관리자-api)
  - [시스템 API](#시스템-api)

---

## 개요

### Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### 요청 형식

- Content-Type: `application/json`
- 인증: Cookie 기반 세션 (Supabase Auth)

### 응답 형식

모든 API는 JSON 형식으로 응답합니다.

---

## 인증

모든 API 요청은 Supabase Auth 세션 쿠키를 통해 인증됩니다.

### 인증 플로우

1. `/register` 페이지에서 Magic Link 로그인
2. 이메일로 받은 링크 클릭
3. `/auth/callback`에서 세션 생성
4. 이후 모든 API 요청에 세션 쿠키 자동 포함

### 권한 레벨

| 레벨 | 설명 | 접근 가능 API |
|------|------|---------------|
| 비인증 | 로그인하지 않은 사용자 | 공개 API만 |
| 인증 (user) | 일반 로그인 사용자 | 사용자 API |
| 관리자 (admin) | 관리자 권한 사용자 | 모든 API |

---

## 공통 응답 형식

### 성공 응답

```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 에러 응답

```json
{
  "error": "에러 메시지",
  "details": "상세 설명 (선택)",
  "code": "에러 코드 (선택)"
}
```

---

## 에러 코드

| HTTP 상태 | 설명 |
|-----------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 (파라미터 오류) |
| 401 | 인증 필요 (Unauthorized) |
| 403 | 접근 권한 없음 (Forbidden) |
| 404 | 리소스 없음 (Not Found) |
| 500 | 서버 내부 오류 |

---

## API 엔드포인트

---

## 인증 API

### POST /api/auth/logout

사용자 로그아웃 처리 및 감사 로그 기록

#### 요청

```http
POST /api/auth/logout
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid-string"
}
```

#### 응답

**성공 (200):**
```json
{
  "success": true
}
```

**에러 (500):**
```json
{
  "error": "Failed to log logout event"
}
```

---

## 데이터 API

### GET /api/data/uploads

사용자의 파일 업로드 목록 조회

#### 요청

```http
GET /api/data/uploads?page=1&limit=20&keyword=&vehicleType=all&startDate=&endDate=
```

**Query Parameters:**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | number | 1 | 페이지 번호 |
| limit | number | 20 | 페이지당 항목 수 |
| keyword | string | "" | 파일명 검색어 |
| vehicleType | string | "all" | 차량 타입 필터 (all, tesla, ionic) |
| startDate | string | "" | 시작일 (ISO 8601) |
| endDate | string | "" | 종료일 (ISO 8601) |

#### 응답

**성공 (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "file_name": "data.csv",
      "file_size": 1024000,
      "file_type": "text/csv",
      "vehicle_type": "tesla",
      "upload_status": "completed",
      "total_records": 1000,
      "processed_records": 1000,
      "created_at": "2025-11-25T10:00:00Z",
      "completed_at": "2025-11-25T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### GET /api/data/{id}

특정 업로드의 상세 데이터 조회

#### 요청

```http
GET /api/data/{id}?page=1&limit=100
```

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | uuid | 업로드 ID |

**Query Parameters:**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | number | 1 | 페이지 번호 |
| limit | number | 100 | 페이지당 데이터 포인트 수 |

#### 응답

**성공 (200):**
```json
{
  "upload": {
    "id": "uuid",
    "file_name": "data.csv",
    "file_size": 1024000,
    "vehicle_type": "tesla",
    "upload_status": "completed",
    "total_records": 5000,
    "processed_records": 5000,
    "created_at": "2025-11-25T10:00:00Z"
  },
  "data": [
    {
      "id": 1,
      "timestamps": 0.0,
      "di_vehicle_speed": 45.5,
      "batt_voltage": 380.2,
      "batt_current": -15.3,
      "soc_ave": 85.5,
      "bms_max_pack_temp": 28.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 5000,
    "totalPages": 50
  }
}
```

**에러 (404):**
```json
{
  "error": "Upload not found"
}
```

---

### DELETE /api/data/{id}

업로드 데이터 삭제 (연관 KPI 데이터 포함)

#### 요청

```http
DELETE /api/data/{id}
```

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | uuid | 업로드 ID |

#### 응답

**성공 (200):**
```json
{
  "success": true,
  "message": "Data deleted successfully"
}
```

**에러 (404):**
```json
{
  "error": "Upload not found"
}
```

---

### GET /api/data/kpi-summary

KPI 요약 데이터 조회

#### 요청

```http
GET /api/data/kpi-summary?uploadId=
```

**Query Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| uploadId | uuid | 특정 업로드 ID (선택, 없으면 최근 10개 조회) |

#### 응답

**특정 업로드 조회 (200):**
```json
{
  "data": {
    "id": 1,
    "upload_id": "uuid",
    "total_dist_km": 45.5,
    "total_energy_wh": 8500,
    "wh_per_100km": 186.8,
    "avg_soc": 72.5,
    "avg_speed": 35.2,
    "avg_pack_temp": 28.5,
    "risk_score": 15.3,
    "aggressive_accel_per100": 2.5,
    "aggressive_brake_per100": 1.8,
    "regen_ratio": 0.25
  }
}
```

**목록 조회 (200):**
```json
{
  "data": [
    {
      "id": 1,
      "upload_id": "uuid",
      "wh_per_100km": 186.8,
      "risk_score": 15.3,
      "file_uploads": {
        "file_name": "data.csv",
        "created_at": "2025-11-25T10:00:00Z"
      }
    }
  ],
  "averages": {
    "avg_aggressive_accel": 2.3,
    "avg_aggressive_brake": 1.5,
    "avg_wh_per_100km": 192.5,
    "avg_regen_ratio": 0.22,
    "avg_soc": 75.0,
    "avg_speed": 38.5,
    "avg_pack_temp": 27.8,
    "avg_risk_score": 18.2,
    "total_distance": 450.5,
    "total_energy": 85000,
    "total_regen": 21250
  },
  "count": 10
}
```

---

## 업로드 API

### POST /api/upload/tesla-kpi

Tesla KPI 데이터 청크 업로드 (3단계 프로세스)

#### 1단계: 초기화 (init)

```http
POST /api/upload/tesla-kpi
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "init",
  "fileName": "battery_data.csv",
  "fileSize": 5242880,
  "totalRecords": 10000
}
```

**응답 (200):**
```json
{
  "success": true,
  "uploadId": "uuid"
}
```

#### 2단계: 청크 데이터 전송 (chunk)

```http
POST /api/upload/tesla-kpi
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "chunk",
  "uploadId": "uuid",
  "chunkIndex": 0,
  "data": [
    {
      "timestamps": 0.0,
      "di_vehicle_speed": 45.5,
      "batt_voltage": 380.2,
      "batt_current": -15.3,
      "pack_power": -5814,
      "soc_ave": 85.5,
      "bms_max_pack_temp": 28.5,
      "delta_t": 0.1,
      "accel": 0.5,
      "energy_wh": 0.16,
      "event_accel": 0,
      "event_brake": 0,
      "risk_score": 12.5
    }
  ]
}
```

**응답 (200):**
```json
{
  "success": true,
  "insertedCount": 1000,
  "totalProcessed": 3000
}
```

#### 3단계: 완료 처리 (finalize)

```http
POST /api/upload/tesla-kpi
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "finalize",
  "uploadId": "uuid",
  "totalRecords": 10000,
  "kpiSummary": {
    "total_dist_km": 45.5,
    "total_energy_wh": 8500,
    "total_regen_wh": 2125,
    "total_time_s": 3600,
    "aggressive_accel_per100": 2.5,
    "aggressive_brake_per100": 1.8,
    "high_speed_ratio": 0.15,
    "wh_per_100km": 186.8,
    "avg_soc": 72.5,
    "avg_speed": 35.2,
    "avg_pack_temp": 28.5,
    "risk_score": 15.3
  }
}
```

**응답 (200):**
```json
{
  "success": true,
  "uploadId": "uuid",
  "recordsProcessed": 10000,
  "totalRecords": 10000,
  "kpiSummary": { ... }
}
```

---

## 차트 API

### GET /api/charts/data

차트 시각화용 시계열 데이터 조회

#### 요청

```http
GET /api/charts/data?uploadId=&startDate=&endDate=&limit=1000
```

**Query Parameters:**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| uploadId | uuid | - | 특정 업로드 ID (선택) |
| startDate | string | - | 시작일 (ISO 8601) |
| endDate | string | - | 종료일 (ISO 8601) |
| limit | number | 1000 | 최대 데이터 포인트 수 |

#### 응답

**KPI 데이터 (200):**
```json
{
  "data": {
    "di_vehicle_speed": [
      { "time_s": 0.0, "value": 45.5 },
      { "time_s": 0.1, "value": 46.2 }
    ],
    "batt_voltage": [
      { "time_s": 0.0, "value": 380.2 },
      { "time_s": 0.1, "value": 380.1 }
    ],
    "batt_current": [
      { "time_s": 0.0, "value": -15.3 },
      { "time_s": 0.1, "value": -16.1 }
    ],
    "soc_ave": [
      { "time_s": 0.0, "value": 85.5 },
      { "time_s": 0.1, "value": 85.4 }
    ],
    "bms_max_pack_temp": [
      { "time_s": 0.0, "value": 28.5 },
      { "time_s": 0.1, "value": 28.6 }
    ],
    "pack_power": [
      { "time_s": 0.0, "value": -5814 },
      { "time_s": 0.1, "value": -6118 }
    ],
    "accel": [
      { "time_s": 0.0, "value": 0.5 },
      { "time_s": 0.1, "value": 0.7 }
    ],
    "risk_score": [
      { "time_s": 0.0, "value": 12.5 },
      { "time_s": 0.1, "value": 13.2 }
    ]
  },
  "count": 1000,
  "dataType": "kpi"
}
```

**사용 가능한 데이터 필드:**

| 필드 | 설명 | 단위 |
|------|------|------|
| di_vehicle_speed | 차량 속도 | km/h |
| di_accel_pedal_pos | 가속 페달 위치 | % |
| batt_voltage | 배터리 전압 | V |
| batt_current | 배터리 전류 | A |
| pack_power | 팩 전력 | W |
| soc_ave | 평균 SOC | % |
| soc_ui | UI 표시 SOC | % |
| bms_max_pack_temp | 최대 팩 온도 | °C |
| bms_min_pack_temp | 최소 팩 온도 | °C |
| coolant_temp_bat_inlet | 냉각수 온도 | °C |
| accel | 가속도 | m/s² |
| jerk | 저크 | m/s³ |
| energy_wh | 에너지 | Wh |
| discharge_wh | 방전 에너지 | Wh |
| regen_wh | 회생 에너지 | Wh |
| event_accel | 급가속 이벤트 | 0/1 |
| event_brake | 급감속 이벤트 | 0/1 |
| risk_score | 위험 점수 | 점수 |

---

## 관리자 API

> **Note:** 모든 관리자 API는 `admin` 역할이 필요합니다.

### GET /api/admin/stats

시스템 통계 조회

#### 요청

```http
GET /api/admin/stats
```

#### 응답

**성공 (200):**
```json
{
  "totalUsers": 150,
  "totalDataPoints": 5000000,
  "totalFileUploads": 450,
  "activeUsersLast7Days": 35
}
```

**에러 (403):**
```json
{
  "error": "Forbidden"
}
```

---

### GET /api/admin/users

전체 사용자 목록 조회

#### 요청

```http
GET /api/admin/users
```

#### 응답

**성공 (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "홍길동",
      "role": "user",
      "created_at": "2025-11-01T10:00:00Z",
      "last_login_at": "2025-11-25T09:00:00Z"
    }
  ]
}
```

---

### PUT /api/admin/users/{id}/role

사용자 역할 변경

#### 요청

```http
PUT /api/admin/users/{id}/role
Content-Type: application/json
```

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | uuid | 사용자 ID |

**Request Body:**
```json
{
  "role": "admin"
}
```

**role 값:**
- `user`: 일반 사용자
- `admin`: 관리자

#### 응답

**성공 (200):**
```json
{
  "success": true
}
```

---

### DELETE /api/admin/users/{id}

사용자 삭제

#### 요청

```http
DELETE /api/admin/users/{id}
```

**Path Parameters:**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | uuid | 사용자 ID |

#### 응답

**성공 (200):**
```json
{
  "success": true
}
```

---

### GET /api/admin/uploads

전체 파일 업로드 목록 조회 (관리자용)

#### 요청

```http
GET /api/admin/uploads?page=1&limit=20&keyword=&userId=
```

**Query Parameters:**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| page | number | 1 | 페이지 번호 |
| limit | number | 20 | 페이지당 항목 수 |
| keyword | string | "" | 파일명 검색어 |
| userId | uuid | "" | 특정 사용자 필터 |

#### 응답

**성공 (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_email": "user@example.com",
      "file_name": "data.csv",
      "file_size": 1024000,
      "file_type": "text/csv",
      "vehicle_type": "tesla",
      "upload_status": "completed",
      "total_records": 5000,
      "processed_records": 5000,
      "created_at": "2025-11-25T10:00:00Z",
      "completed_at": "2025-11-25T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450,
    "totalPages": 23
  }
}
```

---

### GET /api/admin/audit-logs

감사 로그 조회

#### 요청

```http
GET /api/admin/audit-logs
```

#### 응답

**성공 (200):**
```json
{
  "logs": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "action": "LOGIN",
      "resource_type": "user_auth",
      "details": {
        "email": "user@example.com"
      },
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-11-25T10:00:00Z",
      "user_profiles": {
        "email": "user@example.com"
      }
    }
  ]
}
```

**action 값:**
- `LOGIN`: 로그인
- `LOGOUT`: 로그아웃
- `LOGIN_FAILED`: 로그인 실패
- `CREATE`: 생성
- `UPDATE`: 수정
- `DELETE`: 삭제

---

### GET /api/admin/error-logs

에러 로그 조회

#### 요청

```http
GET /api/admin/error-logs
```

#### 응답

**성공 (200):**
```json
{
  "logs": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "error_type": "database_error",
      "error_code": "23505",
      "error_message": "duplicate key value violates unique constraint",
      "context": "file_upload",
      "resource_type": "tesla_kpi_data",
      "request_path": "/api/upload/tesla-kpi",
      "environment": "production",
      "created_at": "2025-11-25T10:00:00Z",
      "user_profiles": {
        "email": "user@example.com"
      }
    }
  ]
}
```

**error_type 값:**
- `validation_error`: 입력값 검증 오류
- `database_error`: 데이터베이스 오류
- `database_insert_error`: DB 삽입 오류
- `upload_error`: 업로드 오류
- `client_error`: 클라이언트 오류
- `unexpected_error`: 예상치 못한 오류

---

## 시스템 API

### GET /api/healthcheck

서버 상태 확인

#### 요청

```http
GET /api/healthcheck
```

#### 응답

**성공 (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T10:00:00Z"
}
```

---

### POST /api/errors/log

클라이언트 에러 로깅

#### 요청

```http
POST /api/errors/log
Content-Type: application/json
```

**Request Body:**
```json
{
  "errorType": "client_error",
  "errorMessage": "Uncaught TypeError: Cannot read property 'x' of undefined",
  "context": "client",
  "requestPath": "/dashboard",
  "environment": "production"
}
```

#### 응답

**성공 (200):**
```json
{
  "success": true
}
```

---

## 데이터 타입 정의

### FileUpload

```typescript
interface FileUpload {
  id: string;              // UUID
  user_id: string;         // UUID
  file_name: string;
  file_size: number;       // bytes
  file_type: string;       // MIME type
  vehicle_type: 'tesla' | 'ionic' | null;
  upload_status: 'uploading' | 'processing' | 'completed' | 'failed';
  storage_path: string | null;
  error_message: string | null;
  total_records: number | null;
  processed_records: number | null;
  created_at: string;      // ISO 8601
  completed_at: string | null;
  deleted_at: string | null;
}
```

### TeslaKPIData

```typescript
interface TeslaKPIData {
  id: number;
  upload_id: string;
  user_id: string;
  timestamps: number;           // 초
  di_vehicle_speed: number;     // km/h
  di_accel_pedal_pos: number;   // %
  batt_voltage: number;         // V
  batt_current: number;         // A
  pack_power: number;           // W
  soc_ave: number;              // %
  bms_max_pack_temp: number;    // °C
  accel: number;                // m/s²
  energy_wh: number;            // Wh
  event_accel: number;          // 0 or 1
  event_brake: number;          // 0 or 1
  risk_score: number;           // 점수
  created_at: string;
}
```

### KPISummary

```typescript
interface KPISummary {
  id: number;
  upload_id: string;
  user_id: string;
  total_dist_km: number;
  total_energy_wh: number;
  total_regen_wh: number;
  total_time_s: number;
  aggressive_accel_per100: number;
  aggressive_brake_per100: number;
  high_speed_ratio: number;
  stop_go_ratio: number;
  accel_rms: number;
  coasting_ratio: number;
  avg_current: number;
  regen_ratio: number;
  wh_per_100km: number;
  avg_soc: number;
  delta_soc: number;
  avg_speed: number;
  max_speed: number;
  idle_per_100km: number;
  high_current_ratio: number;
  soc_violation_ratio: number;
  avg_pack_temp: number;
  high_temp_charging_ratio: number;
  charging_ratio: number;
  max_discharge_current: number;
  risk_score: number;
  created_at: string;
}
```

### AuditLog

```typescript
interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
```

### ErrorLog

```typescript
interface ErrorLog {
  id: string;
  user_id: string | null;
  error_type: string;
  error_code: string | null;
  error_message: string;
  context: string;
  resource_type: string | null;
  resource_id: string | null;
  request_path: string | null;
  ip_address: string | null;
  user_agent: string | null;
  environment: string;
  created_at: string;
}
```

---

## Rate Limiting

현재 Rate Limiting은 적용되어 있지 않습니다. 향후 업데이트 예정입니다.

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2025-11-25 | 초기 문서 작성 |

---

최종 업데이트: 2025-11-25
