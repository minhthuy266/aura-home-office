import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Chỉ can thiệp vào các đường dẫn bắt đầu bằng /out
  if (request.nextUrl.pathname.startsWith('/out')) {
    // Lấy link gốc của Amazon từ tham số url
    const targetUrlParam = request.nextUrl.searchParams.get('url');
    if (!targetUrlParam) return NextResponse.next();

    try {
      const targetUrl = new URL(targetUrlParam);
      
      // 2. Lấy thông tin Quốc gia từ Cloudflare
      const country = request.headers.get('cf-ipcountry');

      // 3. Nếu là IP Việt Nam -> Lột bỏ tham số tag
      if (country === 'VN') {
        targetUrl.searchParams.delete('tag');
      }

      // 4. Redirect user sang Amazon
      return NextResponse.redirect(targetUrl);
    } catch (error) {
      // Fallback nếu URL lỗi
      return NextResponse.next();
    }
  }
}

export const config = {
  // Khai báo để middleware chỉ chạy trên route này, tối ưu performance
  matcher: '/out',
};
