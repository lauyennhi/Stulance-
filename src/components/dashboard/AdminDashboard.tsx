import React, { useState } from 'react';
import {
  AlertTriangle,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  LayoutDashboard,
  Lock,
  LogOut,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminAccountManagementView } from '../admin/AdminAccountManagementView';
import { AdminAuditLogView } from '../admin/AdminAuditLogView';
import { AdminCompanyVerificationView } from '../admin/AdminCompanyVerificationView';
import { AdminOverviewView } from '../admin/AdminOverviewView';
import { AdminTaskApprovalView } from '../admin/AdminTaskApprovalView';
import { AdminViolationReportsView } from '../admin/AdminViolationReportsView';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    companies,
    tasks,
    violationReports,
    currentTab,
    setCurrentTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'home' | 'verify-companies' | 'task-approvals' | 'violation-reports' | 'accounts' | 'audit-logs'
  >('home');

  // Sync with Navbar tab changes
  React.useEffect(() => {
    if (
      currentTab === 'home' ||
      currentTab === 'verify-companies' ||
      currentTab === 'task-approvals' ||
      currentTab === 'violation-reports' ||
      currentTab === 'accounts' ||
      currentTab === 'audit-logs'
    ) {
      setActiveTab(currentTab as any);
    } else if (currentTab === 'moderate-tasks') {
      setActiveTab('task-approvals');
    }
  }, [currentTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
    setCurrentTab(tabId);
  };

  const pendingCompanies = companies.filter((c) => c.status === 'pending').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending_review').length;
  const pendingReports = violationReports.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Admin Persona Bar */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center font-heading font-bold text-xl border border-[#B7E5D0] shrink-0">
              {currentUser?.name.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-[#16243D]">
                  {currentUser?.name || 'ThS. Nguyễn Hoàng Nam'}
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
                  Cán bộ Quản trị Trường
                </span>
              </div>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                {currentUser?.title || 'Phòng Hợp tác Doanh nghiệp & Khảo thí Thử thách Thực tế'} · {currentUser?.university || 'Đại học Bách Khoa Hà Nội'}
              </p>
            </div>
          </div>

          {/* Quick Counter Summary in Header */}
          <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#DCE8F8]">
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-[#5B6B85]">Chờ duyệt DN</p>
              <p className={`font-heading font-bold text-lg ${pendingCompanies > 0 ? 'text-[#B83214]' : 'text-[#0F5B39]'}`}>
                {pendingCompanies}
              </p>
            </div>
            <div className="h-8 w-px bg-[#DCE8F8]" />
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-[#5B6B85]">NV chờ duyệt</p>
              <p className={`font-heading font-bold text-lg ${pendingTasks > 0 ? 'text-[#7A5B00]' : 'text-[#0F5B39]'}`}>
                {pendingTasks}
              </p>
            </div>
            <div className="h-8 w-px bg-[#DCE8F8]" />
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-[#5B6B85]">Báo cáo vi phạm</p>
              <p className={`font-heading font-bold text-lg ${pendingReports > 0 ? 'text-[#B83214]' : 'text-[#0F5B39]'}`}>
                {pendingReports}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Priority for Desktop Clean Command Center) */}
      <div className="flex items-center gap-2 border-b border-[#DCE8F8] pb-3 mb-8 overflow-x-auto">
        <button
          onClick={() => handleTabChange('home')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'home'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Trang chủ tổng quan
        </button>

        <button
          onClick={() => handleTabChange('verify-companies')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'verify-companies'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          Xác minh doanh nghiệp
          {pendingCompanies > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#B83214] text-white text-[10px] flex items-center justify-center font-bold">
              {pendingCompanies}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('task-approvals')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'task-approvals'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Duyệt nhiệm vụ (Bảng kiểm)
          {pendingTasks > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#FFE9A8] text-[#7A5B00] text-[10px] flex items-center justify-center font-bold">
              {pendingTasks}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('violation-reports')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'violation-reports'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Báo cáo vi phạm
          {pendingReports > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#B83214] text-white text-[10px] flex items-center justify-center font-bold">
              {pendingReports}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('accounts')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'accounts'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Quản lý tài khoản
        </button>

        <button
          onClick={() => handleTabChange('audit-logs')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit-logs'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Nhật ký hệ thống
        </button>
      </div>

      {/* VIEW OUTLETS */}
      {activeTab === 'home' && (
        <AdminOverviewView onNavigateTab={handleTabChange} />
      )}

      {activeTab === 'verify-companies' && (
        <AdminCompanyVerificationView />
      )}

      {activeTab === 'task-approvals' && (
        <AdminTaskApprovalView />
      )}

      {activeTab === 'violation-reports' && (
        <AdminViolationReportsView />
      )}

      {activeTab === 'accounts' && (
        <AdminAccountManagementView />
      )}

      {activeTab === 'audit-logs' && (
        <AdminAuditLogView />
      )}
    </div>
  );
};
