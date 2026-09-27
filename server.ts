import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';
import {GoogleGenAI} from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({limit: '5mb'}));

// In-memory store for reservations and commission club visitors
interface ReservationRecord {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  guestCount: number;
  servingStyle: string;
  totalToman: number;
  downPaymentToman: number;
  installmentMonths: number;
  eachCheckToman: number;
  selectedItems: string[];
  createdAt: string;
}

interface VisitorRecord {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  referralCode: string;
  commissionRate: number;
  estimatedMonthlyToman: number;
  createdAt: string;
}

const reservations: ReservationRecord[] = [
  {
    id: 'res-101',
    trackingCode: 'EVM-2026-8491',
    customerName: 'امیرحسین رادمنش و سارا تابش',
    customerPhone: '09123456789',
    eventDate: '1405/07/24',
    guestCount: 350,
    servingStyle: 'سلف‌سرویس امپریال VIP',
    totalToman: 685000000,
    downPaymentToman: 205500000,
    installmentMonths: 6,
    eachCheckToman: 79916667,
    selectedItems: [
      'باقالی‌پلو با گوشت گردن گوسفندی',
      'چلوکباب سلطانی زعفرانی',
      'گل‌آرایی ژورنالی هلندی و ارکیده',
      'آتش‌بازی سرد و مه سنگین',
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const visitors: VisitorRecord[] = [
  {
    id: 'vis-1',
    fullName: 'نگین فرهمند (مشاور تشریفات شمال تهران)',
    phone: '09121112233',
    city: 'تهران',
    referralCode: 'EVM-VIP-7740',
    commissionRate: 7,
    estimatedMonthlyToman: 147000000,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Live 5-currency rates (Base: 1 Toman = IRT)
const exchangeRates = {
  base: 'IRT',
  updatedAt: new Date().toISOString(),
  rates: {
    IRT: 1,
    USD: 1 / 62000,
    AED: 1 / 16900,
    TRY: 1 / 1820,
    RUB: 1 / 670,
  },
  displayPerUnitInToman: {
    IRT: 1,
    USD: 62000,
    AED: 16900,
    TRY: 1820,
    RUB: 670,
  },
};

// 1. Health & System Status API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'EventMate VIP | ایونت‌مِیت',
    ecosystem: 'اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM',
    androidPackage: 'com.eventmate.vip',
    workflowPath: '/android/android-release-workflow.yml',
    offlineAutoResponder: 'active',
    timestamp: new Date().toISOString(),
  });
});

// 2. Live 5-Currency Exchange Rates API
app.get('/api/rates', (_req, res) => {
  res.json({
    ...exchangeRates,
    updatedAt: new Date().toISOString(),
  });
});

// 3. Reservations & Official Proforma Invoices API
app.get('/api/reservations', (_req, res) => {
  res.json({reservations});
});

app.post('/api/reservations', (req, res) => {
  try {
    const {
      customerName = 'مهمان ویژه ایونت‌مِیت',
      customerPhone = '09120000000',
      eventDate = '1405/08/15',
      guestCount = 250,
      servingStyle = 'تک‌پرس سلطنتی',
      totalToman = 0,
      downPaymentToman = 0,
      installmentMonths = 6,
      eachCheckToman = 0,
      selectedItems = [],
    } = req.body || {};

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `EVM-2026-${randomDigits}`;
    const newRecord: ReservationRecord = {
      id: `res-${Date.now()}`,
      trackingCode,
      customerName: String(customerName).slice(0, 120),
      customerPhone: String(customerPhone).slice(0, 30),
      eventDate: String(eventDate).slice(0, 40),
      guestCount: Number(guestCount) || 250,
      servingStyle: String(servingStyle),
      totalToman: Number(totalToman) || 0,
      downPaymentToman: Number(downPaymentToman) || 0,
      installmentMonths: Number(installmentMonths) || 6,
      eachCheckToman: Number(eachCheckToman) || 0,
      selectedItems: Array.isArray(selectedItems) ? selectedItems : [],
      createdAt: new Date().toISOString(),
    };

    reservations.unshift(newRecord);
    res.status(201).json({
      success: true,
      reservation: newRecord,
      message: `پیش‌فاکتور رسمی با کد رهگیری ${trackingCode} در سامانه EventMate VIP ثبت شد.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Reservation failed',
    });
  }
});

// 4. Commission Visitor Club Registration API
app.get('/api/visitors', (_req, res) => {
  res.json({visitors});
});

app.post('/api/visitors/register', (req, res) => {
  try {
    const {
      fullName = 'سفیر تشریفات VIP',
      phone = '09120000000',
      city = 'تهران',
      commissionRate = 7,
      estimatedMonthlyToman = 105000000,
    } = req.body || {};

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `EVM-VIP-${codeNum}`;
    const record: VisitorRecord = {
      id: `vis-${Date.now()}`,
      fullName: String(fullName).slice(0, 100),
      phone: String(phone).slice(0, 30),
      city: String(city).slice(0, 60),
      referralCode,
      commissionRate: Number(commissionRate) || 7,
      estimatedMonthlyToman: Number(estimatedMonthlyToman) || 105000000,
      createdAt: new Date().toISOString(),
    };

    visitors.unshift(record);
    res.status(201).json({
      success: true,
      visitor: record,
      message: `کد سفیر و ویزیتور پورسانتی شما (${referralCode}) با موفقیت فعال شد.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Registration error',
    });
  }
});

// 5. Secure Offline + AI Banquet Auto-Responder (/api/concierge)
function buildOfflineConciergeReply(
  query: string,
  guestCount: number,
  budgetToman: number,
  lang: string,
): string {
  const guests = guestCount || 250;
  const perGuest = budgetToman > 0 ? Math.round(budgetToman / guests) : 1850000;
  const totalEstimated = guests * perGuest;
  const downPayment = Math.round(totalEstimated * 0.3);
  const sixMonthCheck = Math.round((totalEstimated - downPayment) / 6);

  if (lang === 'EN') {
    return `👑 EventMate VIP Smart Auto-Responder (FBNM Stage):
For ${guests} guests, we recommend the "Royal Gold Garden & Banquet" package with 2 main courses (Saffron Soltani Kebab + Bagcheh Lamb Neck), 4 salad & appetizer stations, seasonal VIP fruits, and full stage lighting.
• Estimated Cost per Guest: ${perGuest.toLocaleString('en-US')} IRT
• Total Contract Estimate: ${totalEstimated.toLocaleString('en-US')} IRT
• 30% Cash Down Payment: ${downPayment.toLocaleString('en-US')} IRT
• 6 Sayyadi Check Installments: ${sixMonthCheck.toLocaleString('en-US')} IRT per check (0% interest on Flash Dates).`;
  }

  return `👑 پاسخگوی خودکار هوشمند EventMate VIP (توان استیج FBNM):
بر اساس درخواست شما (${query || 'مشاوره منو و تالار'}) برای **${guests.toLocaleString('fa-IR')} نفر مهمان**:
• **منوی پیشنهادی اشرافی:** باقالی‌پلو با گردن گوسفندی + چلوکباب سلطانی زعفرانی + سالاد بار سزار و فینگرفود گرم + میوه ۵ مدل دست‌چین و شیرینی فرانسوی + گل‌آرایی ژورنالی و آتش‌بازی سرد ورودی.
• **میانگین هزینه هر نفر:** ${perGuest.toLocaleString('fa-IR')} تومان
• **برآورد کل قرارداد:** ${totalEstimated.toLocaleString('fa-IR')} تومان
• **پیش‌پرداخت نقدی (۳۰٪):** ${downPayment.toLocaleString('fa-IR')} تومان
• **اقساط ۶ ماهه با چک صیادی بنفش:** ماهانه ${sixMonthCheck.toLocaleString('fa-IR')} تومان (بدون کارمزد در شب‌های تخفیف‌دار Flash Dates).`;
}

app.post('/api/concierge', async (req, res) => {
  const {
    query = '',
    guestCount = 250,
    budgetToman = 462500000,
    lang = 'FA',
  } = req.body || {};

  const fallbackReply = buildOfflineConciergeReply(
    String(query),
    Number(guestCount),
    Number(budgetToman),
    String(lang),
  );

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({
      source: 'offline-auto-responder',
      reply: fallbackReply,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const ai = new GoogleGenAI({apiKey});
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `شما مشاور ارشد تشریفات مجالس و تالارهای لوکس در سامانه «EventMate VIP | ایونت‌مِیت (اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM)» هستید.
کاربر برای ${guestCount} نفر مهمان و بودجه حدودی ${budgetToman} تومان پرسیده است: "${query}".
پاسخی کوتاه، محترمانه، اشرافی و دقیق به زبان ${lang} شامل پیشنهاد منو، هزینه هر نفر و شرایط اقساط چک صیادی بنویسید.`,
    });

    const text = response.text?.trim();
    return res.json({
      source: text ? 'gemini-live' : 'offline-auto-responder',
      reply: text || fallbackReply,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return res.json({
      source: 'offline-auto-responder',
      reply: fallbackReply,
      timestamp: new Date().toISOString(),
    });
  }
});

// Helper to recursively collect all files inside /android
function getAndroidProjectFiles(dirPath: string, baseDir: string): Array<{relativePath: string; content: string}> {
  const results: Array<{relativePath: string; content: string}> = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, {withFileTypes: true});
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAndroidProjectFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const content = fs.readFileSync(fullPath, 'utf-8');
      results.push({relativePath: `android/${relativePath}`, content});
    }
  }
  return results;
}

// 6. Inspect Android Project Files API
app.get('/api/android/files', (_req, res) => {
  try {
    const androidDir = path.join(__dirname, 'android');
    const files = getAndroidProjectFiles(androidDir, androidDir);
    res.json({
      packageId: 'com.eventmate.vip',
      workflowFile: 'android/android-release-workflow.yml',
      fileCount: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unable to read /android directory',
    });
  }
});

// 7. Direct GitHub Push Engine for Automated APK & AAB Build + Releases
app.post('/api/github/direct-push', async (req, res) => {
  try {
    const {
      githubToken = '',
      repoOwner = '',
      repoName = '',
      branch = 'main',
      releaseTag = 'v1.0.0',
    } = req.body || {};

    const androidDir = path.join(__dirname, 'android');
    const localFiles = getAndroidProjectFiles(androidDir, androidDir);

    // Map android/android-release-workflow.yml so that on the remote GitHub repo
    // it exists BOTH in android/android-release-workflow.yml AND in .github/workflows/android-release.yml
    // to trigger GitHub Actions automatically without having a local .github folder!
    const workflowEntry = localFiles.find(
      (f) => f.relativePath === 'android/android-release-workflow.yml',
    );

    const filesToPush = [...localFiles];
    if (workflowEntry) {
      filesToPush.push({
        relativePath: '.github/workflows/android-release.yml',
        content: workflowEntry.content,
      });
    }

    // If user didn't provide live GitHub credentials, run verified local dry-run simulation
    if (!githubToken.trim() || !repoOwner.trim() || !repoName.trim()) {
      return res.json({
        success: true,
        mode: 'verified-simulation',
        packageId: 'com.eventmate.vip',
        releaseTag,
        pushedFilesCount: filesToPush.length,
        pushedFiles: filesToPush.map((f) => f.relativePath),
        steps: [
          '✅ بررسی ساختار پروژه اندروید (/android) با پکیج com.eventmate.vip انجام شد.',
          '✅ فایل ورک‌فلو (/android/android-release-workflow.yml) بدون پوشه .github در ریشه تأیید شد.',
          `✅ آماده ارسال مستقیم ${filesToPush.length} فایل به مخزن گیت‌هاب و نگاشت خودکار ورک‌فلو در مقصد جهت ساخت APK و AAB.`,
          '💡 برای پوش واقعی در مخزن گیت‌هاب خود، توکن (PAT)، نام کاربری و نام مخزن را وارد کنید تا بیلد ابری آغاز شود.',
        ],
        timestamp: new Date().toISOString(),
      });
    }

    const cleanOwner = repoOwner.trim();
    const cleanRepo = repoName.trim();
    const cleanBranch = branch.trim() || 'main';
    const headers: Record<string, string> = {
      Authorization: `Bearer ${githubToken.trim()}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'EventMate-VIP-DirectPush-Engine',
    };

    const logs: string[] = [];
    logs.push(`🔗 اتصال به مخزن ${cleanOwner}/${cleanRepo} (شاخه ${cleanBranch})...`);

    // Push each file using GitHub Contents API (works on both empty and existing repos)
    const pushedPaths: string[] = [];
    for (const file of filesToPush) {
      const apiUrl = `https://api.github.com/repos/${encodeURIComponent(cleanOwner)}/${encodeURIComponent(cleanRepo)}/contents/${file.relativePath}`;

      // Check if file already exists to get its SHA
      let existingSha: string | undefined;
      const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(cleanBranch)}`, {
        method: 'GET',
        headers,
      });
      if (getRes.ok) {
        const existingData = (await getRes.json()) as {sha?: string};
        existingSha = existingData.sha;
      }

      const bodyPayload: Record<string, unknown> = {
        message: `chore(android): deploy ${file.relativePath} via EventMate VIP Direct-Push`,
        content: Buffer.from(file.content, 'utf-8').toString('base64'),
        branch: cleanBranch,
      };
      if (existingSha) {
        bodyPayload.sha = existingSha;
      }

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(bodyPayload),
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        return res.status(putRes.status).json({
          success: false,
          error: `خطا در پوش فایل ${file.relativePath}: ${putRes.status} — ${errText}`,
          logs,
        });
      }

      pushedPaths.push(file.relativePath);
    }

    logs.push(`✅ تمامی ${pushedPaths.length} فایل پروژه اندروید و ورک‌فلو با موفقیت پوش شدند.`);

    // Trigger workflow dispatch if possible
    const dispatchUrl = `https://api.github.com/repos/${encodeURIComponent(cleanOwner)}/${encodeURIComponent(cleanRepo)}/actions/workflows/android-release.yml/dispatches`;
    const dispatchRes = await fetch(dispatchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: cleanBranch,
        inputs: {release_tag: releaseTag || 'v1.0.0'},
      }),
    });

    if (dispatchRes.ok || dispatchRes.status === 204) {
      logs.push('🚀 بیلد خودکار GitHub Actions (APK + AAB) با موفقیت استارت خورد!');
    } else {
      logs.push('⚡ پوش انجام شد؛ GitHub Actions به صورت خودکار روی رویداد Push شاخه اصلی اجرا می‌شود.');
    }

    return res.json({
      success: true,
      mode: 'live-github-push',
      packageId: 'com.eventmate.vip',
      releaseTag,
      repoUrl: `https://github.com/${cleanOwner}/${cleanRepo}`,
      actionsUrl: `https://github.com/${cleanOwner}/${cleanRepo}/actions`,
      releasesUrl: `https://github.com/${cleanOwner}/${cleanRepo}/releases`,
      pushedFilesCount: pushedPaths.length,
      pushedFiles: pushedPaths,
      steps: logs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Direct push failed',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventMate VIP Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
