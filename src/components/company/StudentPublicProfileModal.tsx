import React from 'react';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Link2,
  Lock,
  Mail,
  Share2,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';
import { ProofCard } from '../common/ProofCard';

interface StudentPublicProfileModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onInvite?: (student: StudentProfile) => void;
}

export const StudentPublicProfileModal: React.FC<StudentPublicProfileModalProps> = ({
  student,
  onClose,
  onInvite,
}) => {
  const { submissions } = useApp();

  if (!student) return null;

  // Filter ONLY public submissions for this student (Rule: "Xem hồ sơ năng lực - chỉ các mục công khai")
  const publicSubmissions = submissions.filter(
    (s) => s.studentId === student.id && s.isPublicInPortfolio === true
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#DCE8F8] bg-[#F5F9FF] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#DCE8F8] overflow-hidden flex items-center justify-center shrink-0">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading font-bold text-2xl text-[#3D7DD8]">
                  {student.name.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-bold text-xl text-[#16243D]">
                  {student.name}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                  Sinh viên năm {student.year}
                </span>
              </div>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                {student.faculty} · {student.major} ({student.cohort})
              </p>
              <p className="text-xs text-[#5B6B85]">
                {student.university}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onInvite && (
              <button
                type="button"
                onClick={() => onInvite(student)}
                className="px-4 py-2 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold hover:bg-[#2F67B5] transition-colors shadow-xs"
              >
                Gửi lời mời
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Headline & Bio */}
          {student.headline && (
            <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs text-[#16243D] italic leading-relaxed">
              &ldquo;{student.headline}&rdquo;
            </div>
          )}

          {student.bio && (
            <div>
              <h4 className="font-heading font-semibold text-xs text-[#16243D] uppercase tracking-wider mb-1.5">
                Giới thiệu bản thân
              </h4>
              <p className="text-xs text-[#5B6B85] leading-relaxed">
                {student.bio}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#DCE8F8]">
            <div>
              <span className="text-[11px] text-[#5B6B85] block">Điểm trung bình bài làm</span>
              <span className="font-heading font-bold text-lg text-[#3D7DD8]">
                {student.averageScore.toFixed(1)} / 10
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#5B6B85] block">Nhiệm vụ đã hoàn thành</span>
              <span className="font-heading font-bold text-lg text-[#16243D]">
                {student.completedTasksCount} bài làm
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#5B6B85] block">Bằng chứng công khai</span>
              <span className="font-heading font-bold text-lg text-[#0F5B39]">
                {publicSubmissions.length} Thẻ bằng chứng
              </span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-heading font-semibold text-xs text-[#16243D] uppercase tracking-wider mb-2">
              Kỹ năng năng lực ({student.skills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-xs font-medium text-[#16243D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Product links */}
          {student.productLinks && student.productLinks.length > 0 && (
            <div>
              <h4 className="font-heading font-semibold text-xs text-[#16243D] uppercase tracking-wider mb-2">
                Sản phẩm & Dự án thực tế
              </h4>
              <div className="space-y-2">
                {student.productLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#DCE8F8] bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-medium text-[#16243D]">{link.label}</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3D7DD8] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      {link.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Public Proof Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading font-semibold text-xs text-[#16243D] uppercase tracking-wider">
                Thẻ bằng chứng công khai ({publicSubmissions.length})
              </h4>
              <span className="text-[11px] text-[#5B6B85]">
                Đã được doanh nghiệp đối tác thẩm định điểm
              </span>
            </div>

            {publicSubmissions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] text-center text-xs text-[#5B6B85]">
                Sinh viên chưa bật công khai Thẻ bằng chứng nào trên hồ sơ.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicSubmissions.map((sub) => (
                  <ProofCard key={sub.id} submission={sub} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DCE8F8] bg-[#F5F9FF] flex items-center justify-between text-xs text-[#5B6B85]">
          <span>Mã sinh viên: <strong>{student.studentCode || 'Đã ẩn bảo mật'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-[#DCE8F8] bg-white text-xs font-medium text-[#16243D] hover:bg-[#EAF2FC]"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
