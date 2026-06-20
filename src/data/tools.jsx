import Base64Tool from '../components/tools/Base64Tool';
import BcryptTool from '../components/tools/BcryptTool';
import BmiCalculator from '../components/tools/BmiCalculator';
import ColorPicker from '../components/tools/ColorPicker';
import CompoundInterest from '../components/tools/CompoundInterest';
import ExcelJSONConverter from '../components/tools/ExcelJSONConverter';
import ImageCompressor from '../components/tools/ImageCompressor';
import ImageConverter from '../components/tools/ImageConverter';
import ImageOCR from '../components/tools/ImageOCR';
import JsonFormatter from '../components/tools/JsonFormatter';
import LoremIpsum from '../components/tools/LoremIpsum';
import MergePDF from '../components/tools/MergePDF';
import PasswordGenerator from '../components/tools/PasswordGenerator';
import PomodoroTimer from '../components/tools/PomodoroTimer';
import QRGenerator from '../components/tools/QRGenerator';
import SignatureTool from '../components/tools/SignatureTool';
import SplitPDF from '../components/tools/SplitPDF';
import TaxCalculator from '../components/tools/TaxCalculator';
import TextTools from '../components/tools/TextTools';
import UnitConverter from '../components/tools/UnitConverter';
import WordToPDF from '../components/tools/WordToPDF';

// New tools v4.0
import HashGenerator      from '../components/tools/HashGenerator';
import JwtDecoder         from '../components/tools/JwtDecoder';
import RegexTester        from '../components/tools/RegexTester';
import CountdownTimer     from '../components/tools/CountdownTimer';
import MarkdownPreviewer  from '../components/tools/MarkdownPreviewer';
import CurrencyConverter  from '../components/tools/CurrencyConverter';
import LoanCalculator     from '../components/tools/LoanCalculator';
import GradientGenerator  from '../components/tools/GradientGenerator';

export const categories = [
  { id: 'all',     name: 'Tất cả' },
  { id: 'doc',     name: 'Tài liệu & PDF' },
  { id: 'img',     name: 'Hình ảnh' },
  { id: 'dev',     name: 'Lập trình & Data' },
  { id: 'utility', name: 'Tiện ích' },
  { id: 'finance', name: 'Tài chính' },
];

export const tools = [
  // ── DEV / IT ─────────────────────────────────────────────────────────
  { id: 'bcrypt',       categoryId: 'dev',     name: 'Bcrypt Generator',     desc: 'Tạo và kiểm tra mã băm Bcrypt (mã hóa mật khẩu)',           emoji: '🛡️',  component: BcryptTool,      tags: ['bảo mật','mã hóa','lập trình'],   color: '#8b5cf6' },
  { id: 'hash',         categoryId: 'dev',     name: 'Hash Generator',       desc: 'Tạo mã băm SHA-1, SHA-256, SHA-384, SHA-512 từ text/file',   emoji: '🔐',  component: HashGenerator,   tags: ['bảo mật','hash','checksum'],       color: '#a78bfa' },
  { id: 'jwt',          categoryId: 'dev',     name: 'JWT Decoder',          desc: 'Giải mã JWT token, xem header, payload và thời hạn',         emoji: '🔓',  component: JwtDecoder,      tags: ['jwt','api','xác thực','lập trình'], color: '#f59e0b' },
  { id: 'regex',        categoryId: 'dev',     name: 'Regex Tester',         desc: 'Kiểm tra và debug Regular Expression với highlight live',    emoji: '🔎',  component: RegexTester,     tags: ['lập trình','regex','text'],        color: '#34d399' },
  { id: 'json-format',  categoryId: 'dev',     name: 'JSON Formatter',       desc: 'Làm đẹp, nén và kiểm tra lỗi file JSON',                    emoji: '{ }', component: JsonFormatter,   tags: ['dữ liệu','json','lập trình'],      color: '#fcd34d' },
  { id: 'base64',       categoryId: 'dev',     name: 'Base64 Encode',        desc: 'Mã hóa và giải mã chuỗi Base64',                            emoji: '🔒',  component: Base64Tool,      tags: ['bảo mật','chuỗi','lập trình'],     color: '#6ee7b7' },
  { id: 'excel-json',   categoryId: 'dev',     name: 'Excel & JSON',         desc: 'Chuyển đổi qua lại giữa Bảng tính và JSON',                 emoji: '📊',  component: ExcelJSONConverter, tags: ['dữ liệu','excel','json'],         color: '#10b981' },
  { id: 'markdown',     categoryId: 'dev',     name: 'Markdown Preview',     desc: 'Viết và xem trước Markdown realtime với split view',         emoji: '📝',  component: MarkdownPreviewer, tags: ['markdown','viết','lập trình'],    color: '#60a5fa' },
  { id: 'color',        categoryId: 'dev',     name: 'Bảng màu',             desc: 'HEX, RGB, HSL và tạo bảng màu hài hòa',                    emoji: '🎨',  component: ColorPicker,     tags: ['thiết kế','màu sắc'],              color: '#f472b6' },
  { id: 'gradient',     categoryId: 'dev',     name: 'CSS Gradient',         desc: 'Tạo gradient CSS đẹp, copy code ngay lập tức',              emoji: '🌈',  component: GradientGenerator, tags: ['thiết kế','css','màu sắc'],       color: '#e879f9' },

  // ── DOCUMENTS & PDF ───────────────────────────────────────────────────
  { id: 'word-pdf',     categoryId: 'doc',     name: 'Word sang PDF',        desc: 'Chuyển file .docx thành định dạng PDF',                     emoji: '📝',  component: WordToPDF,       tags: ['tài liệu','pdf','word'],           color: '#3b82f6' },
  { id: 'merge-pdf',    categoryId: 'doc',     name: 'Gộp PDF',              desc: 'Ghép nhiều file PDF thành 1 file duy nhất',                 emoji: '📑',  component: MergePDF,        tags: ['tài liệu','pdf','gộp'],            color: '#3b82f6' },
  { id: 'split-pdf',    categoryId: 'doc',     name: 'Tách PDF',             desc: 'Trích xuất các trang từ file PDF',                          emoji: '✂️',  component: SplitPDF,        tags: ['tài liệu','pdf','tách'],           color: '#ef4444' },
  { id: 'signature',    categoryId: 'doc',     name: 'Chữ ký số',            desc: 'Vẽ tay hoặc gõ, xuất PNG trong suốt',                      emoji: '✍️',  component: SignatureTool,   tags: ['tài liệu','chữ ký'],               color: '#818cf8' },

  // ── IMAGES ────────────────────────────────────────────────────────────
  { id: 'image-ocr',   categoryId: 'img',     name: 'Trích xuất chữ (OCR)', desc: 'Lấy văn bản từ hình ảnh (Hỗ trợ Tiếng Việt)',              emoji: '👁️',  component: ImageOCR,        tags: ['ảnh','văn bản','ocr'],             color: '#f472b6' },
  { id: 'img-compress', categoryId: 'img',     name: 'Nén ảnh',              desc: 'Giảm dung lượng không mất chất lượng',                     emoji: '📦',  component: ImageCompressor, tags: ['ảnh','tối ưu'],                    color: '#f59e0b' },
  { id: 'img-convert',  categoryId: 'img',     name: 'Chuyển đổi ảnh',       desc: 'PNG, JPG, WebP, BMP, GIF — chuyển đổi hàng loạt',          emoji: '🔄',  component: ImageConverter,  tags: ['ảnh','chuyển đổi'],                color: '#60a5fa' },

  // ── FINANCE ───────────────────────────────────────────────────────────
  { id: 'tax',          categoryId: 'finance', name: 'Tính thuế TNCN',       desc: 'Lương gross → net theo luật Việt Nam 2024',                 emoji: '🧮',  component: TaxCalculator,   tags: ['tài chính','việt nam'],            color: '#fbbf24' },
  { id: 'loan',         categoryId: 'finance', name: 'Tính khoản vay',       desc: 'Tính trả hàng tháng, tổng lãi, bảng amortization',         emoji: '🏦',  component: LoanCalculator,  tags: ['tài chính','ngân hàng','vay'],     color: '#f97316' },
  { id: 'compound',     categoryId: 'finance', name: 'Lãi suất kép',         desc: 'Tính toán lợi nhuận đầu tư và tiết kiệm dài hạn',          emoji: '📈',  component: CompoundInterest, tags: ['tài chính','đầu tư'],             color: '#34d399' },
  { id: 'currency',     categoryId: 'finance', name: 'Chuyển đổi tiền tệ',   desc: 'VND, USD, EUR, GBP, JPY và 10+ loại tiền tệ',              emoji: '💱',  component: CurrencyConverter, tags: ['tài chính','tiền tệ'],           color: '#4ade80' },

  // ── UTILITIES ─────────────────────────────────────────────────────────
  { id: 'qr',           categoryId: 'utility', name: 'Tạo mã QR',            desc: 'URL, WiFi, danh thiếp, văn bản',                           emoji: '▣',   component: QRGenerator,     tags: ['tiện ích','chia sẻ'],              color: '#4ade80' },
  { id: 'countdown',    categoryId: 'utility', name: 'Đếm ngược',            desc: 'Đếm ngược đến ngày giờ bất kỳ theo thời gian thực',       emoji: '⏳',  component: CountdownTimer,  tags: ['thời gian','tiện ích'],            color: '#60a5fa' },
  { id: 'pomodoro',     categoryId: 'utility', name: 'Pomodoro Timer',       desc: 'Tập trung làm việc hiệu quả với kỹ thuật Pomodoro',        emoji: '🍅',  component: PomodoroTimer,   tags: ['năng suất','tiện ích'],            color: '#ef4444' },
  { id: 'lorem-ipsum',  categoryId: 'utility', name: 'Tạo Lorem Ipsum',      desc: 'Tạo đoạn văn bản placeholder nhanh chóng',                emoji: '📃',  component: LoremIpsum,      tags: ['tiện ích','văn bản'],              color: '#a78bfa' },
  { id: 'text',         categoryId: 'utility', name: 'Công cụ Text',          desc: 'Đếm từ, chuyển hoa/thường, sắp xếp, xóa trùng',          emoji: '📄',  component: TextTools,       tags: ['văn bản','tiện ích'],              color: '#34d399' },
  { id: 'bmi',          categoryId: 'utility', name: 'Tính chỉ số BMI',      desc: 'Kiểm tra tình trạng sức khỏe cơ thể',                     emoji: '⚖️',  component: BmiCalculator,   tags: ['sức khỏe','tiện ích'],             color: '#f87171' },
  { id: 'convert',      categoryId: 'utility', name: 'Đổi đơn vị',           desc: 'Độ dài, khối lượng, nhiệt độ, diện tích...',              emoji: '📐',  component: UnitConverter,   tags: ['đo lường','tính toán'],            color: '#2dd4bf' },
  { id: 'password',     categoryId: 'utility', name: 'Tạo mật khẩu',         desc: 'Mật khẩu mạnh và ngẫu nhiên theo tiêu chuẩn bảo mật',    emoji: '🔑',  component: PasswordGenerator, tags: ['bảo mật','tiện ích'],            color: '#a78bfa' },
];
