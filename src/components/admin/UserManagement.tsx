"use client";

import { useState } from "react";
import { Shield, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  created_at: string;
  last_login_at?: string;
}

interface UserManagementProps {
  users: UserProfile[];
  currentUserId: string;
  onRoleChange: (userId: string, newRole: "user" | "admin") => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export function UserManagement({
  users,
  currentUserId,
  onRoleChange,
  onDeleteUser,
}: UserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<"user" | "admin">("user");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChangeClick = (user: UserProfile) => {
    if (user.id === currentUserId) {
      toast.error("자신의 권한은 변경할 수 없습니다.");
      return;
    }
    setSelectedUser(user);
    setNewRole(user.role === "admin" ? "user" : "admin");
    setIsRoleDialogOpen(true);
  };

  const handleDeleteClick = (user: UserProfile) => {
    if (user.id === currentUserId) {
      toast.error("자신의 계정은 삭제할 수 없습니다.");
      return;
    }
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await onRoleChange(selectedUser.id, newRole);
      toast.success(
        `${selectedUser.full_name}님의 권한이 ${
          newRole === "admin" ? "관리자" : "일반 사용자"
        }로 변경되었습니다.`
      );
      setIsRoleDialogOpen(false);
    } catch (error) {
      toast.error("권한 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
      setSelectedUser(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await onDeleteUser(selectedUser.id);
      toast.success(`${selectedUser.full_name}님의 계정이 삭제되었습니다.`);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("계정 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
      setSelectedUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이메일</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>최근 로그인</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="flex w-fit items-center gap-1"
                    >
                      {user.role === "admin" ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <Shield className="h-3 w-3" />
                      )}
                      {user.role === "admin" ? "관리자" : "일반 사용자"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    {user.last_login_at ? formatDate(user.last_login_at) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChangeClick(user)}
                        disabled={user.id === currentUserId}
                      >
                        {user.role === "admin"
                          ? "일반 권한으로"
                          : "관리자 권한으로"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.id === currentUserId}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>권한 변경</DialogTitle>
            <DialogDescription>
              {selectedUser?.full_name}님의 권한을 변경하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={newRole}
              onValueChange={(value: "user" | "admin") => setNewRole(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">일반 사용자</SelectItem>
                <SelectItem value="admin">관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button onClick={confirmRoleChange} disabled={isLoading}>
              {isLoading ? "변경 중..." : "변경"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              계정 삭제 확인
            </DialogTitle>
            <DialogDescription>
              <strong>{selectedUser?.full_name}</strong>님의 계정을
              삭제하시겠습니까?
              <br />
              <br />이 작업은 되돌릴 수 없습니다. 사용자의 모든 데이터가 함께
              삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
