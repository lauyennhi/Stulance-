import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminOverviewViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ onNavigateTab }) => {
  const { companies, tasks, violationReports, managedAccounts, auditLogs } = useApp();

  const pendingCompanies = companies.filter((c) => c.status === 'pending');
  const pendingTasks = tasks.filter((t) => t.status === 'pending_review');
  const pendingReports = violationReports.filter((r) => r.status === 'pending');
  const lockedAccounts = managedAccounts.filter((a) => a.status === 'locked');

  return (
    <div className="space-y-8">
      {/* 3 TOP PRIORITY COUNTERS (Trang chủ: số hồ sơ chờ xác minh, nhiệm vụ chờ duyệt, báo cáo vi phạm chờ xử lý) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Pending Company Verifications */}
        <div
          onClick={() => onNavigateTab('verify-companies')}
          className={`stulance-card p-6 border transition-all cursor-pointer group hover:shadow-md ${
            pendingCompanies.length > 0
              ? 'border-[#FFD6CC] bg-gradient-to-br from-white to-[#FFF8F7]'
              : 'border-[#DCE8F8] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5B6B85] uppercase tracking-wider">
              1. Xác minh doanh nghiệp
            </span>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                pendingCompanies.length > 0
                  ? 'bg-[#FFE9A8] text-[#7A5B00]'
                  : 'bg-[#CDEFE0] text-[#0F5B39]'
              }`}
            >
              <Building className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading font-extrabold text-3xl text-[#16243D]">
              {pendingCompanies.length}
            </span>
            <span className="text-xs text-[#5B6B85]">hồ sơ đối tác mới</span>
          </div>

          <p className="text-xs text-[#5B6B85] mb-4">
            {pendingCompanies.length > 0
              ? 'Có doanh nghiệp đang chờ thẩm định pháp lý để mở đăng tin.'
              : 'Đã hoàn tất duyệt toàn bộ hồ sơ đối tác.'}
          </p>

          <div className="flex items-center justify-between text-xs font-semibold text-[#3D7DD8] group-hover:translate-x-1 transition-transform">
            <span>Duyệt hồ sơ ngay</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 2: Pending Tasks for Approval */}
        <div
          onClick={() => onNavigateTab('task-approvals')}
          className={`stulance-card p-6 border transition-all cursor-pointer group hover:shadow-md ${
            pendingTasks.length > 0
              ? 'border-[#FFE9A8] bg-gradient-to-br from-white to-[#FFFDF5]'
              : 'border-[#DCE8F8] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5B6B85] uppercase tracking-wider">
              2. Nhiệm vụ chờ duyệt
            </span>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                pendingTasks.length > 0
                  ? 'bg-[#FFE9A8] text-[#7A5B00]'
                  : 'bg-[#CDEFE0] text-[#0F5B39]'
              }`}
            >
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading font-extrabold text-3xl text-[#16243D]">
              {pendingTasks.length}
            </span>
            <span className="text-xs text-[#5B6B85]">nhiệm vụ thực tế</span>
          </div>

          <p className="text-xs text-[#5B6B85] mb-4">
            {pendingTasks.length > 0
              ? 'Cần kiểm định khung giờ, thù lao và tiêu chí chấm công khai.'
              : 'Tất cả nhiệm vụ đề xuất đã được thẩm định.'}
          </p>

          <div className="flex items-center justify-between text-xs font-semibold text-[#3D7DD8] group-hover:translate-x-1 transition-transform">
            <span>Xem bảng kiểm tự động</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 3: Pending Violation Reports */}
        <div
          onClick={() => onNavigateTab('violation-reports')}
          className={`stulance-card p-6 border transition-all cursor-pointer group hover:shadow-md ${
            pendingReports.length > 0
              ? 'border-[#FFD6CC] bg-gradient-to-br from-white to-[#FFF2F0]'
              : 'border-[#DCE8F8] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5B6B85] uppercase tracking-wider">
              3. Báo cáo vi phạm chờ xử lý
            </span>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                pendingReports.length > 0
                  ? 'bg-[#FFF2F0] text-[#B83214]'
                  : 'bg-[#CDEFE0] text-[#0F5B39]'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading font-extrabold text-3xl text-[#B83214]">
              {pendingReports.length}
            </span>
            <span className="text-xs text-[#5B6B85]">phản ánh từ người dùng</span>
          </div>

          <p className="text-xs text-[#5B6B85] mb-4">
            {pendingReports.length > 0
              ? 'Cần thẩm tra các phản ánh về thu phí, vượt giờ hoặc sai thông tin.'
              : 'Không có khiếu nại hoặc báo cáo vi phạm nào tồn đọng.'}
          </p>

          <div className="flex items-center justify-between text-xs font-semibold text-[#B83214] group-hover:translate-x-1 transition-transform">
            <span>Xử lý báo cáo</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ACTION QUEUE: VIỆC CẦN XỬ LÝ GẤP */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3D7DD8] text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-[#16243D]">
                Hàng đợi kiểm duyệt ưu tiên
              </h4>
              <p className="text-xs text-[#5B6B85]">
                Tập trung xử lý các mục đang chờ để đảm bảo vận hành thông suốt cho sinh viên và đối tác
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-[#5B6B85]">
            Tổng: {pendingCompanies.length + pendingTasks.length + pendingReports.length} mục
          </span>
        </div>

        {pendingCompanies.length === 0 &&
        pendingTasks.length === 0 &&
        pendingReports.length === 0 ? (
          <div className="p-8 text-center bg-[#F5F9FF] rounded-2xl border border-[#DCE8F8]">
            <CheckCircle2 className="w-8 h-8 text-[#0F5B39] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#16243D]">
              Bàn làm việc của bạn đang trống!
            </p>
            <p className="text-xs text-[#5B6B85] mt-1 max-w-md mx-auto">
              Không có hồ sơ doanh nghiệp, nhiệm vụ hay báo cáo vi phạm nào cần xử lý ngay bây giờ.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending Companies item */}
            {pendingCompanies.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-[#DCE8F8] bg-[#F9FBFD] hover:bg-[#F0F6FF] flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FFE9A8] text-[#7A5B00] shrink-0">
                    Xác minh DN
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-xs text-[#16243D] truncate">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-[#5B6B85] truncate">
                      {c.industry} · Nộp ngày {c.submittedAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('verify-companies')}
                  className="px-3 py-1.5 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold shrink-0 shadow-xs"
                >
                  Xem & Duyệt
                </button>
              </div>
            ))}

            {/* Pending Tasks items */}
            {pendingTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-[#DCE8F8] bg-[#F9FBFD] hover:bg-[#F0F6FF] flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#EAF2FC] text-[#3D7DD8] shrink-0">
                    Duyệt nhiệm vụ
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-xs text-[#16243D] truncate">
                      {t.title}
                    </p>
                    <p className="text-[11px] text-[#5B6B85] truncate">
                      {t.companyName} · {t.estimatedHours}h · {t.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('task-approvals')}
                  className="px-3 py-1.5 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold shrink-0 shadow-xs"
                >
                  Chạy bảng kiểm
                </button>
              </div>
            ))}

            {/* Pending Reports items */}
            {pendingReports.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-[#FFD6CC] bg-[#FFF8F7] hover:bg-[#FFF2F0] flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF2F0] text-[#B83214] shrink-0">
                    Báo cáo vi phạm
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-xs text-[#16243D] truncate">
                      {r.targetTitle}
                    </p>
                    <p className="text-[11px] text-[#B83214] truncate">
                      Lý do: {r.reason} · Gửi lúc {r.createdAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('violation-reports')}
                  className="px-3 py-1.5 rounded-full bg-[#B83214] text-white text-xs font-semibold shrink-0 shadow-xs"
                >
                  Thẩm tra
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECONDARY SYSTEM STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          onClick={() => onNavigateTab('verify-companies')}
          className="stulance-card p-5 border border-[#DCE8F8] bg-white cursor-pointer hover:border-[#A9CFFA] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2">
            <span>DN đã xác minh</span>
            <ShieldCheck className="w-4 h-4 text-[#0F5B39]" />
          </div>
          <p className="font-heading font-bold text-2xl text-[#16243D]">
            {companies.filter((c) => c.status === 'verified').length}
          </p>
          <p className="text-[11px] text-[#0F5B39] mt-1 font-medium">
            100% đầy đủ hồ sơ pháp nhân
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('accounts')}
          className="stulance-card p-5 border border-[#DCE8F8] bg-white cursor-pointer hover:border-[#A9CFFA] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2">
            <span>Tài khoản kiểm soát</span>
            <Users className="w-4 h-4 text-[#3D7DD8]" />
          </div>
          <p className="font-heading font-bold text-2xl text-[#16243D]">
            {managedAccounts.length}
          </p>
          <p className="text-[11px] text-[#5B6B85] mt-1">
            {lockedAccounts.length > 0 ? (
              <span className="text-[#B83214] font-semibold">{lockedAccounts.length} tài khoản bị khóa</span>
            ) : (
              'Không có tài khoản nào bị kỷ luật'
            )}
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('audit-logs')}
          className="stulance-card p-5 border border-[#DCE8F8] bg-white cursor-pointer hover:border-[#A9CFFA] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2">
            <span>Nhật ký hệ thống</span>
            <History className="w-4 h-4 text-[#7A5B00]" />
          </div>
          <p className="font-heading font-bold text-2xl text-[#16243D]">
            {auditLogs.length}
          </p>
          <p className="text-[11px] text-[#3D7DD8] mt-1 font-medium">
            Ghi vết đầy đủ mọi quyết định
          </p>
        </div>
      </div>
    </div>
  );
};
