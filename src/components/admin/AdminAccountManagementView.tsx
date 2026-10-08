import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  GraduationCap,
  History,
  Lock,
  Mail,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccountStatus, ManagedAccount, Role } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const AdminAccountManagementView: React.FC = () => {
  const { managedAccounts, lockAccount, unlockAccount, notify } = useApp();

  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected account for details
  const [inspectingAccount, setInspectingAccount] = useState<ManagedAccount | null>(null);

  // Lock account modal state
  const [lockingAccount, setLockingAccount] = useState<ManagedAccount | null>(null);
  const [lockReasonInput, setLockReasonInput] = useState('');

  // Unlock confirmation state
  const [unlockingAccount, setUnlockingAccount] = useState<ManagedAccount | null>(null);

  const lockedCount = managedAccounts.filter((a) => a.status === 'locked').length;

  const filteredAccounts = managedAccounts.filter((acc) => {
    const matchesRole = roleFilter === 'all' || acc.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.organization && acc.organization.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleConfirmLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockingAccount) return;
    if (!lockReasonInput.trim()) {
      notify('Thiếu lý do', 'Vui lòng cung cấp lý do khóa tài khoản cụ thể.', 'error');
      return;
    }

    lockAccount(lockingAccount.id, lockReasonInput.trim());
    if (inspectingAccount?.id === lockingAccount.id) {
      setInspectingAccount({
        ...inspectingAccount,
        status: 'locked',
        lockReason: lockReasonInput.trim(),
      });
    }
    setLockingAccount(null);
    setLockReasonInput('');
  };

  const handleConfirmUnlock = () => {
    if (!unlockingAccount) return;
    unlockAccount(unlockingAccount.id);
    if (inspectingAccount?.id === unlockingAccount.id) {
      setInspectingAccount({
        ...inspectingAccount,
        status: 'active',
        lockReason: undefined,
      });
    }
    setUnlockingAccount(null);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'student':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8] flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            Sinh viên
          </span>
        );
      case 'company':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center gap-1">
            <Building className="w-3 h-3" />
            Doanh nghiệp
          </span>
        );
      case 'admin':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Admin trường
          </span>
        );
      case 'school':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214] flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Nhà trường
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-xl text-[#16243D]">
            Quản trị & Kiểm soát tài khoản người dùng
          </h3>
          <p className="text-xs text-[#5B6B85] mt-1">
            Tra cứu lý lịch hoạt động, kiểm tra tiền sử vi phạm quy chế, thực hiện khóa hoặc mở khóa tài khoản theo thẩm quyền.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lockedCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FFF2F0] text-[#B83214] border border-[#FFD6CC] flex items-center gap-1.5 shadow-xs">
              <Lock className="w-3.5 h-3.5" />
              {lockedCount} tài khoản đang bị khóa
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="stulance-card p-4 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#3D7DD8] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              Tất cả ({managedAccounts.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === 'active'
                  ? 'bg-[#0F5B39] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              Hoạt động ({managedAccounts.length - lockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === 'locked'
                  ? 'bg-[#B83214] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              Bị khóa ({lockedCount})
            </button>
          </div>

          <span className="text-[#DCE8F8]">|</span>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] outline-none"
          >
            <option value="all">Mọi vai trò</option>
            <option value="student">Sinh viên</option>
            <option value="company">Doanh nghiệp</option>
            <option value="admin">Cán bộ Quản trị</option>
            <option value="school">Nhà trường</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email, trường, công ty..."
            className="w-full pl-8 pr-3.5 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/20"
          />
        </div>
      </div>

      {/* Account List */}
      {filteredAccounts.length === 0 ? (
        <EmptyState
          icon={User}
          title="Không tìm thấy tài khoản nào"
          description="Không có tài khoản nào phù hợp với bộ lọc và từ khóa tìm kiếm của bạn."
          actionText="Bỏ lọc"
          onAction={() => {
            setRoleFilter('all');
            setStatusFilter('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredAccounts.map((account) => {
            const isLocked = account.status === 'locked';
            return (
              <div
                key={account.id}
                className={`stulance-card p-4 sm:p-5 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isLocked
                    ? 'border-[#FFD6CC] bg-[#FFF8F7]'
                    : 'border-[#DCE8F8] bg-white hover:border-[#A9CFFA]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-heading font-bold text-base shrink-0 border ${
                      isLocked
                        ? 'bg-[#FFD6CC] text-[#B83214] border-[#FFBBAA]'
                        : 'bg-[#EAF2FC] text-[#3D7DD8] border-[#DCE8F8]'
                    }`}
                  >
                    {account.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-heading font-bold text-sm text-[#16243D]">
                        {account.name}
                      </h4>
                      {getRoleBadge(account.role)}
                      {isLocked ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#B83214] text-white flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Đang bị khóa
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Hoạt động
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5B6B85]">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {account.email}
                      </span>
                      {account.organization && (
                        <>
                          <span>·</span>
                          <span className="text-[#16243D] font-medium">
                            {account.organization}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <span>Tham gia: {account.createdAt}</span>
                    </div>

                    {isLocked && account.lockReason && (
                      <p className="text-[11px] text-[#B83214] mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Lý do khóa: <strong>{account.lockReason}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right badges & actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2.5 md:pt-0 w-full md:w-auto justify-end">
                  {account.violationCount > 0 && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FFF2F0] text-[#B83214] border border-[#FFD6CC] flex items-center gap-1">
                      <History className="w-3 h-3" />
                      {account.violationCount} vi phạm
                    </span>
                  )}

                  <button
                    onClick={() => setInspectingAccount(account)}
                    className="px-3.5 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs font-medium text-[#16243D] hover:bg-[#EAF2FC] transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Lịch sử & Chi tiết
                  </button>

                  {isLocked ? (
                    <button
                      onClick={() => setUnlockingAccount(account)}
                      className="px-4 py-1.5 rounded-full bg-[#0F5B39] hover:bg-[#0A442A] text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Unlock className="w-3 h-3" />
                      Mở khóa
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setLockingAccount(account);
                        setLockReasonInput('');
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#B83214] text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Khóa tài khoản
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ACCOUNT DETAILS & VIOLATION HISTORY MODAL */}
      {inspectingAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#DCE8F8] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#3D7DD8] font-heading font-bold text-lg flex items-center justify-center border border-[#DCE8F8]">
                  {inspectingAccount.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-lg text-[#16243D]">
                      {inspectingAccount.name}
                    </h3>
                    {getRoleBadge(inspectingAccount.role)}
                  </div>
                  <p className="text-xs text-[#5B6B85] mt-0.5">{inspectingAccount.email}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingAccount(null)}
                className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Info Box */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-[#5B6B85] block">Đơn vị / Tổ chức:</span>
                  <strong className="text-[#16243D]">
                    {inspectingAccount.organization || 'Cá nhân'}
                  </strong>
                </div>
                <div>
                  <span className="text-[11px] text-[#5B6B85] block">Thời điểm tạo tài khoản:</span>
                  <strong className="text-[#16243D]">{inspectingAccount.createdAt}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-[#5B6B85] block">Trạng thái hiện tại:</span>
                  <strong>
                    {inspectingAccount.status === 'locked' ? (
                      <span className="text-[#B83214]">ĐANG BỊ KHÓA HOẠT ĐỘNG</span>
                    ) : (
                      <span className="text-[#0F5B39]">ĐANG HOẠT ĐỘNG BÌNH THƯỜNG</span>
                    )}
                  </strong>
                </div>
                <div>
                  <span className="text-[11px] text-[#5B6B85] block">Số lần ghi nhận vi phạm:</span>
                  <strong className="text-[#B83214]">
                    {inspectingAccount.violationCount} lần
                  </strong>
                </div>
              </div>

              {/* Lock notice if locked */}
              {inspectingAccount.status === 'locked' && (
                <div className="p-4 rounded-xl bg-[#FFF2F0] border border-[#FFD6CC] text-xs text-[#B83214]">
                  <h5 className="font-semibold flex items-center gap-1.5 mb-1">
                    <Lock className="w-4 h-4" />
                    Biên bản khóa tài khoản
                  </h5>
                  <p>
                    <strong>Lý do:</strong> {inspectingAccount.lockReason || 'Vi phạm điều khoản'}
                  </p>
                  <p className="text-[11px] text-[#5B6B85] mt-1">
                    Thực hiện bởi: {inspectingAccount.lockedBy || 'Hội đồng Quản trị'} · Ngày: {inspectingAccount.lockedAt || 'Gần đây'}
                  </p>
                </div>
              )}

              {/* Violation History Table */}
              <div>
                <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#5B6B85] mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Lịch sử vi phạm & xử lý kỷ luật
                </h5>
                {inspectingAccount.violationHistory.length === 0 ? (
                  <p className="text-xs text-[#5B6B85] italic p-3 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8]">
                    Tài khoản chưa có bất kỳ tiền sử vi phạm nào.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {inspectingAccount.violationHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-[#DCE8F8] bg-white text-xs flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#B83214]">{item.action}</span>
                          <span className="text-[11px] text-[#5B6B85]">{item.date}</span>
                        </div>
                        <p className="text-[#16243D] text-[11px]">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-3 pt-5 border-t border-[#DCE8F8] mt-6">
              <button
                type="button"
                onClick={() => setInspectingAccount(null)}
                className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
              >
                Đóng
              </button>

              <div>
                {inspectingAccount.status === 'locked' ? (
                  <button
                    onClick={() => {
                      setUnlockingAccount(inspectingAccount);
                      setInspectingAccount(null);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#0F5B39] hover:bg-[#0A442A] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Mở khóa tài khoản này
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLockingAccount(inspectingAccount);
                      setLockReasonInput('');
                      setInspectingAccount(null);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#B83214] hover:bg-[#99260E] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Khóa tài khoản này
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCK ACCOUNT REASON MODAL */}
      {lockingAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-md bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF2F0] text-[#B83214] flex items-center justify-center border border-[#FFD6CC] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  Khóa tài khoản người dùng
                </h3>
                <p className="text-xs text-[#5B6B85]">
                  Tài khoản: <strong>{lockingAccount.name}</strong> ({lockingAccount.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5B6B85] mb-4">
              Khi bị khóa, tài khoản này sẽ không thể đăng nhập, không thể nộp bài hoặc đăng tuyển nhiệm vụ mới. Bắt buộc nhập lý do xử lý:
            </p>

            <form onSubmit={handleConfirmLock} className="space-y-4">
              <textarea
                rows={3}
                required
                value={lockReasonInput}
                onChange={(e) => setLockReasonInput(e.target.value)}
                placeholder="Ví dụ: Vi phạm quy chế đào tạo sinh viên lần 2, tiếp tục yêu cầu nộp lệ phí ngoài quy định..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#B83214]/20 resize-none bg-[#F5F9FF]"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLockingAccount(null);
                    setLockReasonInput('');
                  }}
                  className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!lockReasonInput.trim()}
                  className="px-5 py-2.5 bg-[#B83214] text-white text-xs font-semibold rounded-full hover:bg-[#99260E] disabled:bg-gray-300 transition-colors shadow-xs"
                >
                  Xác nhận khóa tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNLOCK ACCOUNT CONFIRMATION MODAL */}
      {unlockingAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-md bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center border border-[#B7E5D0] shrink-0">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  Mở khóa tài khoản
                </h3>
                <p className="text-xs text-[#5B6B85]">
                  Phục hồi quyền truy cập cho: <strong>{unlockingAccount.name}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5B6B85] mb-5">
              Tài khoản này sẽ được cấp lại quyền đăng nhập và tham gia các hoạt động bình thường trên nền tảng Stulance. Thao tác mở khóa sẽ được lưu vào nhật ký hệ thống.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#DCE8F8]">
              <button
                type="button"
                onClick={() => setUnlockingAccount(null)}
                className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmUnlock}
                className="px-5 py-2.5 bg-[#0F5B39] text-white text-xs font-semibold rounded-full hover:bg-[#0A442A] transition-colors shadow-xs"
              >
                Xác nhận mở khóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
