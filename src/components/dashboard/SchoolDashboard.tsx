import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Building,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Layers,
  LineChart,
  PieChart,
  School,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FacultyReportData } from '../../types';

export const SchoolDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    submissions,
    tasks,
    companies,
    invitations,
    facultyStats,
    exportSchoolReportCSV,
    notify,
  } = useApp();

  const [selectedFaculty, setSelectedFaculty] = useState<string>('Tất cả');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Học kỳ 1 (2025–2026)');
  const [chartMetric, setChartMetric] = useState<'submissions' | 'scores'>('submissions');
  const [sortBy, setSortBy] = useState<'completed' | 'score' | 'stipend'>('completed');

  // Compute 4 Core KPI Metrics requested by School:
  // 1. Sinh viên tham gia
  const participatingStudentsCount = students.length;

  // 2. Nhiệm vụ hoàn thành (bài nộp đã được chấm)
  const completedTasksCount = submissions.filter((s) => s.status === 'graded').length;

  // 3. Lời mời đã gửi (lời mời từ doanh nghiệp gửi cho sinh viên)
  const sentInvitationsCount = invitations.length;

  // 4. Doanh nghiệp đang hoạt động (DN đã xác minh có nhiệm vụ hoặc tin tuyển dụng)
  const activeCompaniesCount = companies.filter(
    (c) => c.status === 'verified' && c.taskCount > 0
  ).length;

  // Total stipend paid to students
  const totalStipendEarned = submissions
    .filter((s) => s.status === 'graded')
    .reduce((sum, s) => {
      const task = tasks.find((t) => t.id === s.taskId);
      return sum + (task ? task.rewardVND : 0);
    }, 0);

  // Filtered faculty table
  const filteredFacultyData = facultyStats.filter((f) => {
    if (selectedFaculty === 'Tất cả') return true;
    return f.facultyName.toLowerCase().includes(selectedFaculty.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'completed') return b.completedTasksCount - a.completedTasksCount;
    if (sortBy === 'score') return b.averageScore - a.averageScore;
    return b.totalRewardVND - a.totalRewardVND;
  });

  // Monthly trend mock data for the time-series chart
  const monthlyTrendData = [
    { month: 'Tháng 10', submissions: 18, completed: 15, avgScore: 8.6 },
    { month: 'Tháng 11', submissions: 27, completed: 24, avgScore: 8.9 },
    { month: 'Tháng 12', submissions: 35, completed: 31, avgScore: 9.1 },
    { month: 'Tháng 1', submissions: 42, completed: 38, avgScore: 9.3 },
    { month: 'Tháng 2', submissions: 48, completed: 44, avgScore: 9.2 },
    { month: 'Tháng 3', submissions: 56, completed: 51, avgScore: 9.5 },
  ];

  const handleExport = () => {
    exportSchoolReportCSV(selectedFaculty, selectedTimeframe);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* School Persona Header */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD6CC] text-[#B83214] flex items-center justify-center font-heading font-bold text-xl border border-[#FFBBAA] shrink-0">
              <School className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-[#16243D]">
                  {currentUser?.name || 'PGS.TS Lê Hải Yến'}
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214]">
                  Nhà trường · Xem Báo cáo
                </span>
              </div>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                {currentUser?.title || 'Phó Trưởng ban Khảo thí & Đảm bảo chất lượng'} · {currentUser?.university || 'Đại học Bách Khoa Hà Nội'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={handleExport}
              className="px-5 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo kiểm định (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS: Khoa & Khoảng thời gian */}
      <div className="stulance-card p-4 sm:p-5 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#3D7DD8]" />
            <span className="text-xs font-semibold text-[#16243D]">Bộ lọc báo cáo:</span>
          </div>

          {/* Khoa Filter */}
          <div className="relative">
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs font-medium text-[#16243D] outline-none cursor-pointer focus:ring-2 focus:ring-[#3D7DD8]/20"
            >
              <option value="Tất cả">Tất cả Khoa / Viện</option>
              <option value="Công nghệ thông tin">Khoa CNTT & Truyền thông</option>
              <option value="Kinh tế">Khoa Kinh tế & QTKD</option>
              <option value="Thiết kế">Khoa Mỹ thuật & Thiết kế</option>
              <option value="Ngoại ngữ">Khoa Ngoại ngữ</option>
              <option value="Du lịch">Khoa Du lịch & Khách sạn</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5B6B85] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeframe Filter */}
          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs font-medium text-[#16243D] outline-none cursor-pointer focus:ring-2 focus:ring-[#3D7DD8]/20"
            >
              <option value="Học kỳ 1 (2025–2026)">Học kỳ 1 (2025–2026)</option>
              <option value="Học kỳ 2 (2025–2026)">Học kỳ 2 (2025–2026)</option>
              <option value="30 ngày qua">30 ngày gần nhất</option>
              <option value="Toàn khóa học">Toàn khóa đào tạo (Toàn bộ)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5B6B85] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="text-xs text-[#5B6B85] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#3D7DD8]" />
          <span>Dữ liệu tính đến: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></span>
        </div>
      </div>

      {/* 4 CORE KPI CARDS (Bắt buộc theo yêu cầu: sinh viên tham gia, nhiệm vụ hoàn thành, lời mời đã gửi, doanh nghiệp đang hoạt động) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Sinh viên tham gia */}
        <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
          <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2">
            <span>Sinh viên tham gia</span>
            <Users className="w-4 h-4 text-[#3D7DD8]" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-[#16243D]">
            {participatingStudentsCount}
          </p>
          <p className="text-[11px] text-[#0F5B39] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            100% có sản phẩm thực tế
          </p>
        </div>

        {/* KPI 2: Nhiệm vụ hoàn thành */}
        <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
          <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2">
            <span>Nhiệm vụ hoàn thành</span>
            <CheckCircle2 className="w-4 h-4 text-[#0F5B39]" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-[#16243D]">
            {completedTasksCount}
          </p>
          <p className="text-[11px] text-[#0F5B39] font-medium mt-1">
            Đã cấp thẻ bằng chứng minh thực
          </p>
        </div>

        {/* KPI 3: Lời mời đã gửi */}
        <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
          <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2">
            <span>Lời mời đã gửi</span>
            <Award className="w-4 h-4 text-[#7A5B00]" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-[#16243D]">
            {sentInvitationsCount}
          </p>
          <p className="text-[11px] text-[#3D7DD8] font-medium mt-1">
            Phỏng vấn & Dự án ngắn từ DN
          </p>
        </div>

        {/* KPI 4: Doanh nghiệp đang hoạt động */}
        <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
          <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2">
            <span>Doanh nghiệp hoạt động</span>
            <Building className="w-4 h-4 text-[#16243D]" />
          </div>
          <p className="font-heading font-extrabold text-3xl text-[#16243D]">
            {activeCompaniesCount}
          </p>
          <p className="text-[11px] text-[#0F5B39] font-medium mt-1">
            Đã thẩm định pháp lý & mở đề bài
          </p>
        </div>
      </div>

      {/* BIỂU ĐỒ THEO THỜI GIAN (Time-series visual chart) */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#16243D]">
              Biểu đồ xu hướng hoàn thành & chất lượng theo thời gian
            </h3>
            <p className="text-xs text-[#5B6B85] mt-0.5">
              Theo dõi sự gia tăng số lượng bài làm đạt chuẩn và biến thiên điểm đánh giá năng lực qua từng tháng
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartMetric('submissions')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                chartMetric === 'submissions'
                  ? 'bg-[#3D7DD8] text-white'
                  : 'bg-[#F5F9FF] text-[#5B6B85] border border-[#DCE8F8]'
              }`}
            >
              Số bài nộp & Hoàn thành
            </button>
            <button
              onClick={() => setChartMetric('scores')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                chartMetric === 'scores'
                  ? 'bg-[#3D7DD8] text-white'
                  : 'bg-[#F5F9FF] text-[#5B6B85] border border-[#DCE8F8]'
              }`}
            >
              Điểm đánh giá TB (/10)
            </button>
          </div>
        </div>

        {/* SVG Visualization */}
        <div className="pt-4 pb-2">
          {chartMetric === 'submissions' ? (
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2 border-b border-[#DCE8F8]">
                {monthlyTrendData.map((d, idx) => {
                  const maxH = 60; // Max reference height
                  const subH = (d.submissions / maxH) * 100;
                  const compH = (d.completed / maxH) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                        {/* Submissions Bar */}
                        <div
                          style={{ height: `${subH}%` }}
                          className="w-1/2 max-w-[28px] bg-[#A9CFFA] rounded-t-lg transition-all group-hover:bg-[#85B9F7] relative flex items-center justify-center"
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[10px] font-bold text-[#16243D] bg-white px-1.5 py-0.5 rounded shadow-xs border border-[#DCE8F8] whitespace-nowrap z-10 transition-opacity">
                            {d.submissions} nộp
                          </span>
                        </div>

                        {/* Completed Bar */}
                        <div
                          style={{ height: `${compH}%` }}
                          className="w-1/2 max-w-[28px] bg-[#3D7DD8] rounded-t-lg transition-all group-hover:bg-[#2B63B6] relative flex items-center justify-center"
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[10px] font-bold text-white bg-[#16243D] px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap z-10 transition-opacity">
                            {d.completed} đạt
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#5B6B85] mt-2 whitespace-nowrap">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 text-xs text-[#5B6B85] pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-[#A9CFFA]" />
                  <span>Tổng bài nộp thử thách</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-[#3D7DD8]" />
                  <span>Đã chấm đạt chuẩn năng lực</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2 border-b border-[#DCE8F8]">
                {monthlyTrendData.map((d, idx) => {
                  const scorePercentage = (d.avgScore / 10) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full flex items-end justify-center h-full">
                        <div
                          style={{ height: `${scorePercentage}%` }}
                          className="w-full max-w-[40px] bg-gradient-to-t from-[#CDEFE0] to-[#0F5B39] rounded-t-lg relative flex items-center justify-center group-hover:brightness-95 transition-all"
                        >
                          <span className="text-white text-[11px] font-bold mb-1">
                            {d.avgScore}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#5B6B85] mt-2 whitespace-nowrap">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Score Chart Legend */}
              <div className="flex items-center justify-center gap-2 text-xs text-[#5B6B85] pt-2">
                <div className="w-3.5 h-3.5 rounded bg-[#0F5B39]" />
                <span>Điểm trung bình rubric doanh nghiệp đánh giá (Thang 10)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BẢNG THEO KHOA (Faculty Breakdown Table) */}
      <div className="stulance-card border border-[#DCE8F8] bg-white overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#DCE8F8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#16243D]">
              Bảng kết quả đào tạo & Năng lực sinh viên theo Khoa
            </h3>
            <p className="text-xs text-[#5B6B85] mt-0.5">
              Đo lường năng lực giải quyết bài toán thực tế của sinh viên từng đơn vị đào tạo
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5B6B85]">Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs font-semibold text-[#16243D] outline-none"
            >
              <option value="completed">Số nhiệm vụ hoàn thành</option>
              <option value="score">Điểm đánh giá TB</option>
              <option value="stipend">Tổng thù lao nhận</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F9FF] border-b border-[#DCE8F8] text-[#5B6B85] font-semibold">
                <th className="py-3.5 px-5">Khoa / Viện đào tạo</th>
                <th className="py-3.5 px-4 text-center">Sinh viên tham gia</th>
                <th className="py-3.5 px-4 text-center">Nhiệm vụ hoàn thành</th>
                <th className="py-3.5 px-4 text-center">Điểm đánh giá TB</th>
                <th className="py-3.5 px-4 text-center">Lời mời việc làm</th>
                <th className="py-3.5 px-4 text-center">Trúng tuyển</th>
                <th className="py-3.5 px-5 text-right">Tổng thù lao SV nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8F8]">
              {filteredFacultyData.map((fac, idx) => (
                <tr key={idx} className="hover:bg-[#F9FBFD] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#EAF2FC] text-[#3D7DD8] font-heading font-bold text-xs flex items-center justify-center shrink-0 border border-[#DCE8F8]">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-heading font-bold text-sm text-[#16243D] block">
                          {fac.facultyName}
                        </span>
                        <span className="text-[11px] text-[#5B6B85]">
                          Chuyên ngành kỹ năng thực hành
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-semibold text-[#16243D]">
                    {fac.studentCount}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-heading font-bold text-xs px-2.5 py-1 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                      <CheckCircle2 className="w-3 h-3" />
                      {fac.completedTasksCount} bài
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="font-heading font-bold text-xs px-2.5 py-1 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
                      {fac.averageScore} / 10
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center text-[#7A5B00] font-semibold">
                    {fac.interviewInvitesCount} lời mời
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                      {fac.hiredCount} sinh viên
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right font-heading font-bold text-[#16243D]">
                    {formatVND(fac.totalRewardVND)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#F5F9FF] font-semibold text-[#16243D] border-t border-[#DCE8F8]">
                <td className="py-4 px-5">Tổng toàn trường</td>
                <td className="py-4 px-4 text-center">
                  {filteredFacultyData.reduce((sum, f) => sum + f.studentCount, 0)}
                </td>
                <td className="py-4 px-4 text-center">
                  {filteredFacultyData.reduce((sum, f) => sum + f.completedTasksCount, 0)}
                </td>
                <td className="py-4 px-4 text-center font-bold text-[#0F5B39]">
                  {(
                    filteredFacultyData.reduce((sum, f) => sum + f.averageScore, 0) /
                    (filteredFacultyData.length || 1)
                  ).toFixed(1)} / 10
                </td>
                <td className="py-4 px-4 text-center">
                  {filteredFacultyData.reduce((sum, f) => sum + f.interviewInvitesCount, 0)}
                </td>
                <td className="py-4 px-4 text-center">
                  {filteredFacultyData.reduce((sum, f) => sum + f.hiredCount, 0)}
                </td>
                <td className="py-4 px-5 text-right text-[#0F5B39] font-bold">
                  {formatVND(filteredFacultyData.reduce((sum, f) => sum + f.totalRewardVND, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
