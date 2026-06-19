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

export const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'doc', name: 'Tài liệu & PDF' },
  { id: 'img', name: 'Hình ảnh' },
  { id: 'dev', name: 'Lập trình & Data' },
  { id: 'utility', name: 'Tiện ích' },
  { id: 'finance', name: 'Tài chính' },
];

export const tools = [
  { id:'bcrypt', categoryId:'dev', name:'Bcrypt Generator', desc:'Tạo và kiểm tra mã băm Bcrypt', emoji:'🛡️', component:BcryptTool, tags:['bảo mật','mã hóa','lập trình'], color:'#8b5cf6' },
  { id:'json-format', categoryId:'dev', name:'JSON Formatter', desc:'Làm đẹp, nén và kiểm tra lỗi file JSON', emoji:'{ }', component:JsonFormatter, tags:['dữ liệu','json','lập trình'], color:'#fcd34d' },
  { id:'base64', categoryId:'dev', name:'Base64 Encode', desc:'Mã hóa và giải mã chuỗi Base64', emoji:'🔒', component:Base64Tool, tags:['bảo mật','chuỗi','lập trình'], color:'#6ee7b7' },
  { id:'excel-json', categoryId:'dev', name:'Excel & JSON', desc:'Chuyển đổi qua lại giữa Bảng tính và JSON', emoji:'📊', component:ExcelJSONConverter, tags:['dữ liệu','excel','json'], color:'#10b981' },
  { id:'color', categoryId:'dev', name:'Bảng màu', desc:'HEX, RGB, HSL và palette', emoji:'🎨', component:ColorPicker, tags:['thiết kế','màu sắc'], color:'#f472b6' },

  { id:'word-pdf', categoryId:'doc', name:'Word sang PDF', desc:'Chuyển file .docx thành định dạng PDF', emoji:'📝', component:WordToPDF, tags:['tài liệu','pdf','word'], color:'#3b82f6' },
  { id:'merge-pdf', categoryId:'doc', name:'Gộp PDF', desc:'Ghép nhiều file PDF thành 1 file duy nhất', emoji:'📑', component:MergePDF, tags:['tài liệu','pdf','gộp'], color:'#3b82f6' },
  { id:'split-pdf', categoryId:'doc', name:'Tách PDF', desc:'Trích xuất các trang từ file PDF', emoji:'✂️', component:SplitPDF, tags:['tài liệu','pdf','tách'], color:'#ef4444' },
  { id:'signature', categoryId:'doc', name:'Chữ ký số', desc:'Vẽ tay hoặc gõ, xuất PNG trong suốt', emoji:'✍️', component:SignatureTool, tags:['tài liệu','chữ ký'], color:'#818cf8' },
  
  { id:'image-ocr', categoryId:'img', name:'Trích xuất chữ (OCR)', desc:'Lấy văn bản từ hình ảnh (Hỗ trợ Tiếng Việt)', emoji:'👁️', component:ImageOCR, tags:['ảnh','văn bản','ocr'], color:'#f472b6' },
  { id:'img-compress', categoryId:'img', name:'Nén ảnh', desc:'Giảm dung lượng không mất chất lượng', emoji:'📦', component:ImageCompressor, tags:['ảnh','tối ưu'], color:'#f59e0b' },
  { id:'img-convert', categoryId:'img', name:'Chuyển đổi ảnh', desc:'PNG, JPG, WebP, BMP, GIF', emoji:'🔄', component:ImageConverter, tags:['ảnh','chuyển đổi'], color:'#60a5fa' },
  
  { id:'compound-interest', categoryId:'finance', name:'Lãi suất kép', desc:'Tính toán lợi nhuận đầu tư và tiết kiệm', emoji:'📈', component:CompoundInterest, tags:['tài chính','đầu tư'], color:'#34d399' },
  { id:'tax', categoryId:'finance', name:'Tính thuế TNCN', desc:'Lương gross → net theo luật VN', emoji:'🧮', component:TaxCalculator, tags:['tài chính','việt nam'], color:'#fbbf24' },

  { id:'lorem-ipsum', categoryId:'utility', name:'Tạo Lorem Ipsum', desc:'Tạo đoạn văn bản giả để thiết kế', emoji:'📃', component:LoremIpsum, tags:['tiện ích','văn bản'], color:'#a78bfa' },
  { id:'bmi', categoryId:'utility', name:'Tính chỉ số BMI', desc:'Kiểm tra tình trạng sức khỏe cơ thể', emoji:'⚖️', component:BmiCalculator, tags:['sức khỏe','tiện ích'], color:'#f87171' },
  { id:'qr', categoryId:'utility', name:'Tạo mã QR', desc:'URL, WiFi, danh thiếp, văn bản', emoji:'▣', component:QRGenerator, tags:['tiện ích','chia sẻ'], color:'#4ade80' },
  { id:'password', categoryId:'utility', name:'Tạo mật khẩu', desc:'Mật khẩu mạnh và bảo mật', emoji:'🔑', component:PasswordGenerator, tags:['bảo mật'], color:'#a78bfa' },
  { id:'pomodoro', categoryId:'utility', name:'Pomodoro Timer', desc:'Tập trung làm việc hiệu quả', emoji:'🍅', component:PomodoroTimer, tags:['năng suất'], color:'#ef4444' },
  { id:'text', categoryId:'utility', name:'Công cụ Text', desc:'Đếm từ, chuyển chữ hoa/thường, sắp xếp', emoji:'📝', component:TextTools, tags:['văn bản','tiện ích'], color:'#34d399' },
  { id:'convert', categoryId:'utility', name:'Đổi đơn vị', desc:'Độ dài, khối lượng, nhiệt độ...', emoji:'📐', component:UnitConverter, tags:['đo lường','tính toán'], color:'#2dd4bf' },
];
