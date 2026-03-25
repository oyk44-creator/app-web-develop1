"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Users, Database, FileText, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemStats, SystemStatsData } from "@/components/admin/SystemStats";
import { UserManagement, UserProfile } from "@/components/admin/UserManagement";
import { AllDataTable, FileUploadRow } from "@/components/admin/AllDataTable";
import { AuditLogsTable, AuditLog } from "@/components/admin/AuditLogsTable";
import { ErrorLogsTable, ErrorLog } from "@/components/admin/ErrorLogsTable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UploadsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminPage() {
  const { user } = useAuth();

  // System stats from API
  const [systemStats, setSystemStats] = useState<SystemStatsData>({
    totalUsers: 0,
    totalDataPoints: 0,
    totalFileUploads: 0,
    activeUsersLast7Days: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Users from API
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // File uploads from API
  const [fileUploads, setFileUploads] = useState<FileUploadRow[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsPagination, setUploadsPagination] = useState<UploadsPagination>(
    {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    }
  );
  const [uploadsKeyword, setUploadsKeyword] = useState("");
  const [uploadsUserFilter, setUploadsUserFilter] = useState("");

  // Audit logs from API
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(true);

  // Error logs from API
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [errorLogsLoading, setErrorLogsLoading] = useState(true);

  // Fetch system stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setSystemStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch file uploads
  const fetchUploads = useCallback(
    async (page = 1, keyword = "", userId = "") => {
      setUploadsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          ...(keyword && { keyword }),
          ...(userId && { userId }),
        });

        const response = await fetch(`/api/admin/uploads?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFileUploads(data.data || []);
          setUploadsPagination(
            data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
          );
        } else {
          console.error("Failed to fetch uploads:", await response.text());
        }
      } catch (error) {
        console.error("Failed to fetch uploads:", error);
      } finally {
        setUploadsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUploads(uploadsPagination.page, uploadsKeyword, uploadsUserFilter);
  }, []);

  const handleUploadsPageChange = (newPage: number) => {
    setUploadsPagination((prev) => ({ ...prev, page: newPage }));
    fetchUploads(newPage, uploadsKeyword, uploadsUserFilter);
  };

  const handleUploadsSearch = (keyword: string) => {
    setUploadsKeyword(keyword);
    setUploadsPagination((prev) => ({ ...prev, page: 1 }));
    fetchUploads(1, keyword, uploadsUserFilter);
  };

  const handleUploadsUserFilter = (userId: string) => {
    setUploadsUserFilter(userId);
    setUploadsPagination((prev) => ({ ...prev, page: 1 }));
    fetchUploads(1, uploadsKeyword, userId);
  };

  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch("/api/admin/audit-logs");
        if (response.ok) {
          const data = await response.json();
          setAuditLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setAuditLogsLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  // Fetch error logs
  useEffect(() => {
    const fetchErrorLogs = async () => {
      try {
        const response = await fetch("/api/admin/error-logs");
        if (response.ok) {
          const data = await response.json();
          setErrorLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Failed to fetch error logs:", error);
      } finally {
        setErrorLogsLoading(false);
      }
    };

    fetchErrorLogs();
  }, []);

  // Handle role change
  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success("사용자 역할이 변경되었습니다.");
        // Refresh users list
        await fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "역할 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to change role:", error);
      toast.error("역할 변경 중 오류가 발생했습니다.");
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("사용자가 삭제되었습니다.");
        // Refresh users list
        await fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "사용자 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("사용자 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1>관리자 페이지</h1>
        </div>
        <p className="text-muted-foreground">
          시스템 전체를 관리하고 모니터링할 수 있습니다.
        </p>
      </div>

      {/* System Stats Overview */}
      <div className="mb-8">
        {statsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">통계 로딩 중...</div>
          </div>
        ) : (
          <SystemStats stats={systemStats} />
        )}
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[650px]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">사용자 관리</span>
            <span className="sm:hidden">사용자</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">전체 데이터</span>
            <span className="sm:hidden">데이터</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">감사 로그</span>
            <span className="sm:hidden">감사</span>
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">오류 로그</span>
            <span className="sm:hidden">오류</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">사용자 관리</h2>
            <p className="mb-4 text-muted-foreground">
              사용자 권한을 관리하고 계정을 삭제할 수 있습니다.
            </p>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">로딩 중...</div>
              </div>
            ) : (
              <UserManagement
                users={users}
                currentUserId={user?.id || ""}
                onRoleChange={handleRoleChange}
                onDeleteUser={handleDeleteUser}
              />
            )}
          </div>
        </TabsContent>

        {/* All Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              전체 사용자 파일 업로드
            </h2>
            <p className="mb-4 text-muted-foreground">
              모든 사용자의 업로드된 파일을 조회할 수 있습니다. 파일을 클릭하면
              상세 페이지로 이동합니다.
            </p>
            <AllDataTable
              data={fileUploads}
              loading={uploadsLoading}
              pagination={uploadsPagination}
              onPageChange={handleUploadsPageChange}
              onSearch={handleUploadsSearch}
              onUserFilter={handleUploadsUserFilter}
            />
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">감사 로그</h2>
            <p className="mb-4 text-muted-foreground">
              시스템의 모든 사용자 활동을 모니터링할 수 있습니다. (로그인,
              로그아웃, 데이터 변경 등)
            </p>
            {auditLogsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">로딩 중...</div>
              </div>
            ) : (
              <AuditLogsTable logs={auditLogs} />
            )}
          </div>
        </TabsContent>

        {/* Error Logs Tab */}
        <TabsContent value="errors" className="space-y-4">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">시스템 오류 로그</h2>
            <p className="mb-4 text-muted-foreground">
              서버 및 클라이언트에서 발생한 모든 오류를 확인할 수 있습니다.
            </p>
            {errorLogsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">로딩 중...</div>
              </div>
            ) : (
              <ErrorLogsTable logs={errorLogs} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
