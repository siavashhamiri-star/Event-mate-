import React, {useEffect, useState} from 'react';
import {
  Smartphone,
  GitBranch,
  Rocket,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import {LanguageCode} from '../types';

interface AndroidFileEntry {
  relativePath: string;
  content: string;
}

interface AndroidGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
}

export const AndroidGithubModal: React.FC<AndroidGithubModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [androidFiles, setAndroidFiles] = useState<AndroidFileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<AndroidFileEntry | null>(
    null,
  );
  const [copiedFile, setCopiedFile] = useState(false);

  // Direct Push Engine state
  const [githubToken, setGithubToken] = useState('');
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('eventmate-vip-android');
  const [branch, setBranch] = useState('main');
  const [releaseTag, setReleaseTag] = useState('v1.0.0');
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{
    success: boolean;
    mode?: string;
    steps?: string[];
    error?: string;
    actionsUrl?: string;
    releasesUrl?: string;
    pushedFiles?: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/android/files')
        .then((r) => r.json())
        .then((data: {files?: AndroidFileEntry[]}) => {
          if (data.files?.length) {
            setAndroidFiles(data.files);
            const wf =
              data.files.find((f) =>
                f.relativePath.includes('android-release-workflow.yml'),
              ) || data.files[0];
            setSelectedFile(wf);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isRtl = lang === 'FA' || lang === 'AR';

  const handleDirectPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setPushing(true);
    setPushResult(null);
    try {
      const res = await fetch('/api/github/direct-push', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          githubToken,
          repoOwner,
          repoName,
          branch,
          releaseTag,
        }),
      });
      const data = await res.json();
      setPushResult(data);
    } catch (error) {
      setPushResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'خطا در ارتباط با موتور پوش مستقیم',
      });
    } finally {
      setPushing(false);
    }
  };

  const handleCopyContent = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E130D]/75 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-5xl rounded-2xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#2C1E16] text-[#FAF7F2] px-6 py-4 border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E6C258]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#FAF7F2]">
                {lang === 'FA'
                  ? 'استودیو ساخت خودکار APK و AAB اندروید + موتور پوش مستقیم گیت‌هاب'
                  : 'Android APK & AAB Studio + Direct GitHub Push Engine'}
              </h3>
              <p className="text-xs text-[#E6C258] font-mono-num">
                Package: com.eventmate.vip | Workflow: /android/android-release-workflow.yml
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#FAF7F2]/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Direct Push Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C59B27]/50 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#2C1E16]">
                <Rocket className="w-5 h-5 text-[#9A7411]" />
                <span>
                  موتور پوش مستقیم (/api/github/direct-push) جهت بیلد ابری APK و AAB
                </span>
              </div>

              <p className="text-xs text-[#6E5A4F] leading-relaxed">
                این موتور تمام فایل‌های پوشه <code className="font-mono-num font-bold">/android</code> و فایل ورک‌فلو <code className="font-mono-num font-bold">/android/android-release-workflow.yml</code> را به مخزن گیت‌هاب شما پوش کرده و به صورت خودکار خروجی نصبی <strong>APK</strong> و <strong>AAB</strong> را در بخش <strong>Releases</strong> منتشر می‌کند.
              </p>

              <form onSubmit={handleDirectPush} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                    توکن دسترسی گیت‌هاب (GitHub PAT - اختیاری برای تست):
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx (خالی = بررسی و شبیه‌سازی آنی)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono-num text-[#2C1E16]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                      نام کاربری گیت‌هاب (Owner):
                    </label>
                    <input
                      type="text"
                      value={repoOwner}
                      onChange={(e) => setRepoOwner(e.target.value)}
                      placeholder="e.g. siavashhamiri"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono-num text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                      نام مخزن (Repository):
                    </label>
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="eventmate-vip"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono-num text-[#2C1E16]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                      شاخه (Branch):
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono-num text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                      تگ انتشار (Release Tag):
                    </label>
                    <input
                      type="text"
                      value={releaseTag}
                      onChange={(e) => setReleaseTag(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6DFD3] text-xs font-mono-num text-[#2C1E16]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pushing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition"
                >
                  <GitBranch className="w-4 h-4" />
                  {pushing
                    ? 'در حال اجرای موتور Direct-Push...'
                    : githubToken.trim()
                      ? 'پوش مستقیم به گیت‌هاب و استارت بیلد APK/AAB'
                      : 'تأیید ساختار /android و اجرای تست موتور Direct-Push'}
                </button>
              </form>

              {pushResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    pushResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-red-50 border-red-300 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {pushResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>
                      {pushResult.success
                        ? 'عملیات موتور Direct-Push با موفقیت انجام شد'
                        : pushResult.error}
                    </span>
                  </div>
                  {pushResult.steps?.map((s, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {s}
                    </div>
                  ))}
                  {pushResult.releasesUrl && (
                    <div className="flex gap-3 pt-1">
                      <a
                        href={pushResult.actionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#9A7411] underline"
                      >
                        مشاهده GitHub Actions <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={pushResult.releasesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#9A7411] underline"
                      >
                        دانلود از Releases <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Live File Explorer for /android */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#2C1E16] text-[#FAF7F2] border border-[#C59B27] overflow-hidden">
            <div className="px-4 py-3 bg-[#1E130D] border-b border-[#C59B27]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E6C258]">
                <FileCode className="w-4 h-4" />
                <span>
                  فایل‌های پروژه کامل اندروید (/android — بدون پوشه .github در ریشه)
                </span>
              </div>
              {selectedFile && (
                <button
                  onClick={handleCopyContent}
                  className="px-2.5 py-1 rounded-lg bg-[#C59B27]/20 text-[#E6C258] text-xs font-bold flex items-center gap-1 hover:bg-[#C59B27]/30 transition"
                >
                  {copiedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> کپی شد
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> کپی سورس فایل
                    </>
                  )}
                </button>
              )}
            </div>

            {/* File tabs */}
            <div className="flex overflow-x-auto gap-1.5 p-2.5 bg-[#251811] border-b border-white/10">
              {androidFiles.map((f) => (
                <button
                  key={f.relativePath}
                  onClick={() => setSelectedFile(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-num shrink-0 transition ${
                    selectedFile?.relativePath === f.relativePath
                      ? 'bg-[#C59B27] text-[#1E130D] font-bold'
                      : 'bg-white/5 text-[#E6DFD3] hover:bg-white/10'
                  }`}
                >
                  {f.relativePath}
                </button>
              ))}
            </div>

            {/* Code viewer */}
            <pre
              dir="ltr"
              className="p-4 text-xs font-mono-num text-[#E6DFD3] overflow-auto max-h-[380px] leading-relaxed"
            >
              {selectedFile?.content || 'Loading /android files...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
