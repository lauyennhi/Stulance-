import React, { useState } from 'react';
import {
  Bell,
  Briefcase,
  ChevronDown,
  GraduationCap,
  Layers,
  LogOut,
  Menu,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeRole,
    quickLoginAs,
    logout,
    openAuth,
    currentTab,
    setCurrentTab,
    resetMockData,
    unreadNotificationCount,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { id: 'hero', label: 'Trang chủ' },
        { id: 'steps', label: 'Cách hoạt động' },
        { id: 'proofs', label: 'Thẻ bằng chứng' },
        { id: 'tasks-preview', label: 'Nhiệm vụ mẫu' },
      ];
    }

    switch (activeRole) {
      case 'student':
        return [
          { id: 'home', label: 'Trang chủ' },
          { id: 'search_tasks', label: 'Tìm nhiệm vụ' },
          { id: 'my_tasks', label: 'Nhiệm vụ của tôi' },
          { id: 'portfolio', label: 'Hồ sơ năng lực' },
          { id: 'jobs', label: 'Tin tuyển dụng' },
          { id: 'invitations', label: 'Lời mời' },
        ];
      case 'company':
        return [
          { id: 'home', label: 'Trang chủ' },
          { id: 'company-tasks', label: 'Nhiệm vụ' },
          { id: 'grade-submissions', label: 'Chấm bài' },
          { id: 'projects', label: 'Dự án ngắn' },
          { id: 'top-candidates', label: 'Tìm sinh viên' },
          { id: 'jobs', label: 'Tuyển dụng & Kanban' },
          { id: 'verification', label: 'Hồ sơ & Pháp lý' },
        ];
      case 'admin':
        return [
          { id: 'home', label: 'Tổng quan' },
          { id: 'verify-companies', label: 'Duyệt DN' },
          { id: 'task-approvals', label: 'Duyệt nhiệm vụ' },
          { id: 'violation-reports', label: 'Báo cáo vi phạm' },
          { id: 'accounts', label: 'Tài khoản' },
          { id: 'audit-logs', label: 'Nhật ký' },
        ];
      case 'school':
        return [
          { id: 'home', label: 'Báo cáo tổng hợp' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);

    if (!currentUser) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getRoleBadgeLabel = (role: Role) => {
    switch (role) {
      case 'student':
        return 'Sinh viên';
      case 'company':
        return 'Doanh nghiệp';
      case 'admin':
        return 'Cán bộ Admin';
      case 'school':
        return 'Nhà trường';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* ZONE 1: Brand Wordmark with Demo Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#3D7DD8] flex items-center justify-center text-white font-heading font-bold text-base shadow-xs group-hover:bg-[#2F67B5] transition-colors">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-[#16243D] tracking-tight leading-none">
                  Stulance
                </span>
                <span className="text-[10px] text-[#5B6B85] hidden sm:block tracking-normal mt-0.5 font-medium">
                  Tuyển bằng nhiệm vụ thật
                </span>
              </div>
            </button>

            {/* Nhãn nhỏ "Bản demo" ở góc thanh điều hướng theo đúng đề bài */}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] border border-[#F0DC94] shrink-0">
              Bản demo
            </span>
          </div>

          {/* ZONE 2: Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5B6B85]">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#3D7DD8] font-semibold'
                      : 'text-[#5B6B85] hover:text-[#16243D]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D7DD8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Actions & Role Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Quick Role Switcher for Demo testing */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs font-medium text-[#16243D] hover:bg-[#EAF2FC] transition-colors"
                title="Chuyển vai trò demo nhanh"
              >
                <Layers className="w-3.5 h-3.5 text-[#3D7DD8]" />
                <span className="truncate max-w-[110px]">
                  {currentUser ? getRoleBadgeLabel(currentUser.role) : 'Đổi vai trò demo'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#5B6B85]" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#DCE8F8] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-[#DCE8F8] mb-1">
                    <p className="text-[11px] font-semibold text-[#5B6B85] uppercase tracking-wider">
                      Vào nhanh vai trò demo
                    </p>
                  </div>
                  <button
                    onClick={() => quickLoginAs('student')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F5F9FF] flex items-center gap-2.5 text-xs text-[#16243D] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#EAF2FC] text-[#3D7DD8] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold">Sinh viên</p>
                      <p className="text-[11px] text-[#5B6B85]">Nguyễn Minh Khang (Bách Khoa)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => quickLoginAs('company')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F5F9FF] flex items-center gap-2.5 text-xs text-[#16243D] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center justify-center shrink-0">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold">Doanh nghiệp</p>
                      <p className="text-[11px] text-[#5B6B85]">Nexus Software Studio (Đã xác minh)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => quickLoginAs('admin')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F5F9FF] flex items-center gap-2.5 text-xs text-[#16243D] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold">Cán bộ Admin</p>
                      <p className="text-[11px] text-[#5B6B85]">Thầy Trần Quốc Tuấn (Duyệt DN)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => quickLoginAs('school')}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F5F9FF] flex items-center gap-2.5 text-xs text-[#16243D] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FFD6CC] text-[#B83214] flex items-center justify-center shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold">Nhà trường</p>
                      <p className="text-[11px] text-[#5B6B85]">TS. Vũ Mai Lan (Xem báo cáo)</p>
                    </div>
                  </button>

                  <div className="border-t border-[#DCE8F8] mt-1 pt-1">
                    <button
                      onClick={resetMockData}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#F5F9FF] flex items-center gap-2 text-[11px] text-[#5B6B85] hover:text-[#16243D] transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-[#5B6B85]" />
                      Khôi phục dữ liệu ban đầu
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated user vs Guest buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => setCurrentTab('notifications')}
                    className="relative p-2 text-[#5B6B85] hover:text-[#3D7DD8] hover:bg-[#EAF2FC] rounded-full transition-colors"
                    title="Thông báo"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B83214]" />
                    )}
                  </button>
                )}
                <div className="hidden lg:flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-[#16243D] leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#5B6B85] leading-tight truncate max-w-[130px]">
                    {getRoleBadgeLabel(currentUser.role)}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-2 text-[#5B6B85] hover:text-[#B83214] hover:bg-[#FFF2F0] rounded-full transition-colors"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#16243D] hover:text-[#3D7DD8] transition-colors rounded-full"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => openAuth('register_student')}
                  className="px-4 py-2 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
                >
                  Bắt đầu ngay
                </button>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#5B6B85] hover:text-[#16243D] rounded-lg transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#DCE8F8] animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-1 pb-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                    currentTab === link.id
                      ? 'bg-[#EAF2FC] text-[#3D7DD8] font-semibold'
                      : 'text-[#16243D] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#DCE8F8]">
              <p className="px-3 text-[11px] font-semibold text-[#5B6B85] uppercase tracking-wider mb-2">
                Chuyển nhanh vai trò (Demo)
              </p>
              <div className="grid grid-cols-2 gap-2 px-1">
                <button
                  onClick={() => {
                    quickLoginAs('student');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs font-medium text-left hover:bg-[#EAF2FC]"
                >
                  🎓 Sinh viên
                </button>
                <button
                  onClick={() => {
                    quickLoginAs('company');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs font-medium text-left hover:bg-[#EAF2FC]"
                >
                  🏢 Doanh nghiệp
                </button>
                <button
                  onClick={() => {
                    quickLoginAs('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs font-medium text-left hover:bg-[#EAF2FC]"
                >
                  🛡️ Admin trường
                </button>
                <button
                  onClick={() => {
                    quickLoginAs('school');
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs font-medium text-left hover:bg-[#EAF2FC]"
                >
                  🏫 Báo cáo trường
                </button>
              </div>

              {currentUser && (
                <div className="mt-3 pt-3 border-t border-[#DCE8F8] flex items-center justify-between px-3">
                  <div className="text-xs">
                    <span className="font-semibold block text-[#16243D]">{currentUser.name}</span>
                    <span className="text-[#5B6B85] text-[11px]">{getRoleBadgeLabel(currentUser.role)}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-[#B83214] font-medium px-3 py-1.5 rounded-full bg-[#FFF2F0]"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
