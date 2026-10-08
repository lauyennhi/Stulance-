import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Eye,
  Filter,
  GraduationCap,
  Mail,
  Search,
  Send,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { SendInviteModal } from './SendInviteModal';
import { StudentPublicProfileModal } from './StudentPublicProfileModal';

export const FindStudentsView: React.FC = () => {
  const { students } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [majorFilter, setMajorFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [minTasksFilter, setMinTasksFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('');

  // Selected student for Profile modal or Invite modal
  const [viewingProfileStudent, setViewingProfileStudent] = useState<StudentProfile | null>(null);
  const [invitingStudent, setInvitingStudent] = useState<StudentProfile | null>(null);

  // Rule: "Chỉ hiện sinh viên bật cho phép tìm thấy"
  const visibleStudents = students.filter((s) => s.allowCompaniesToFindMe === true);

  // Apply filters
  const filteredStudents = visibleStudents.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMajor =
      majorFilter === 'all' || st.major.toLowerCase().includes(majorFilter.toLowerCase());

    const matchesYear = yearFilter === 'all' || st.year.toString() === yearFilter;

    const matchesTasks =
      minTasksFilter === 'all' ||
      st.completedTasksCount >= parseInt(minTasksFilter, 10);

    const matchesSkill =
      !skillFilter.trim() ||
      st.skills.some((sk) => sk.toLowerCase().includes(skillFilter.trim().toLowerCase()));

    return matchesSearch && matchesMajor && matchesYear && matchesTasks && matchesSkill;
  });

  // Extract unique majors
  const allMajors = Array.from(new Set(visibleStudents.map((s) => s.major)));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading font-bold text-xl text-[#16243D]">
              Tìm kiếm sinh viên theo Thẻ bằng chứng thực tế
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
              {visibleStudents.length} ứng viên mở tìm kiếm
            </span>
          </div>
          <p className="text-xs text-[#5B6B85]">
            Chỉ hiển thị các bạn sinh viên đã bật công tắc &ldquo;Cho phép doanh nghiệp tìm thấy tôi&rdquo;. Đánh giá bằng sản phẩm thật thay cho CV.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="stulance-card p-5 border border-[#DCE8F8] bg-white space-y-4">
        {/* Search Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên sinh viên, trường, chuyên ngành..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Lọc theo kỹ năng cụ thể (ví dụ: React, SEO, Excel, Figma)..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          {/* Lọc theo ngành */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#5B6B85]">Ngành:</span>
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
            >
              <option value="all">Tất cả ngành</option>
              {allMajors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo năm học */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#5B6B85]">Năm học:</span>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
            >
              <option value="all">Tất cả các năm</option>
              <option value="1">Năm 1</option>
              <option value="2">Năm 2</option>
              <option value="3">Năm 3</option>
              <option value="4">Năm 4</option>
            </select>
          </div>

          {/* Lọc theo số nhiệm vụ hoàn thành */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#5B6B85]">Số bài làm:</span>
            <select
              value={minTasksFilter}
              onChange={(e) => setMinTasksFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
            >
              <option value="all">Bất kỳ</option>
              <option value="1">≥ 1 nhiệm vụ đã làm</option>
              <option value="2">≥ 2 nhiệm vụ đã làm</option>
              <option value="3">≥ 3 nhiệm vụ đã làm</option>
            </select>
          </div>

          {(searchQuery || majorFilter !== 'all' || yearFilter !== 'all' || minTasksFilter !== 'all' || skillFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setMajorFilter('all');
                setYearFilter('all');
                setMinTasksFilter('all');
                setSkillFilter('');
              }}
              className="text-[#3D7DD8] hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Grid of Student Cards */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Không tìm thấy sinh viên phù hợp"
          description="Thử mở rộng các tiêu chí lọc ngành hoặc kỹ năng tìm kiếm."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col justify-between hover:border-[#A9CFFA] transition-all"
            >
              <div>
                {/* Header card with name & score circle */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] border border-[#DCE8F8] overflow-hidden flex items-center justify-center shrink-0">
                      {st.avatar ? (
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-heading font-bold text-lg text-[#3D7DD8]">
                          {st.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#16243D]">
                        {st.name}
                      </h3>
                      <p className="text-xs text-[#5B6B85] mt-0.5">
                        Năm {st.year} · {st.major}
                      </p>
                      <p className="text-[11px] text-[#5B6B85] truncate max-w-[180px]">
                        {st.university}
                      </p>
                    </div>
                  </div>

                  {/* Vòng tròn điểm trung bình */}
                  <div className="w-12 h-12 rounded-full border-2 border-[#3D7DD8] bg-[#F5F9FF] flex flex-col items-center justify-center shrink-0 shadow-2xs">
                    <span className="font-heading font-bold text-xs text-[#16243D]">
                      {st.averageScore.toFixed(1)}
                    </span>
                    <span className="text-[8px] text-[#5B6B85]">/ 10</span>
                  </div>
                </div>

                {/* Headline quote */}
                {st.headline && (
                  <p className="text-xs text-[#5B6B85] line-clamp-2 italic mb-3">
                    &ldquo;{st.headline}&rdquo;
                  </p>
                )}

                {/* Skills */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-[#5B6B85] mb-4">
                  {st.skills.slice(0, 5).map((skill, idx) => (
                    <React.Fragment key={skill}>
                      <span className="text-[#16243D] font-medium">{skill}</span>
                      {idx < Math.min(st.skills.length, 5) - 1 && (
                        <span aria-hidden="true">·</span>
                      )}
                    </React.Fragment>
                  ))}
                  {st.skills.length > 5 && (
                    <span className="text-[#5B6B85] text-[10px]">
                      +{st.skills.length - 5}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#DCE8F8] flex items-center justify-between text-xs">
                <span className="text-[#5B6B85]">
                  Đã làm <strong>{st.completedTasksCount}</strong> bài
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingProfileStudent(st)}
                    className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs font-medium text-[#16243D] hover:bg-[#EAF2FC] transition-colors"
                  >
                    Xem hồ sơ
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvitingStudent(st)}
                    className="px-3.5 py-1.5 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold hover:bg-[#2F67B5] transition-colors shadow-xs"
                  >
                    Mời ứng tuyển
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Public Profile Modal */}
      {viewingProfileStudent && (
        <StudentPublicProfileModal
          student={viewingProfileStudent}
          onClose={() => setViewingProfileStudent(null)}
          onInvite={(st) => {
            setViewingProfileStudent(null);
            setInvitingStudent(st);
          }}
        />
      )}

      {/* Send Invite Modal */}
      {invitingStudent && (
        <SendInviteModal
          student={invitingStudent}
          isOpen={!!invitingStudent}
          onClose={() => setInvitingStudent(null)}
        />
      )}
    </div>
  );
};
