/* ============================================================
   SCRIPT.JS — Tự động sửa lỗi HTML & Tạo Menu Đẹp (Fix trùng lặp)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DỌN DẸP LỖI HTML CŨ (Xóa sạch thanh menu cũ bị lỗi)
    // Tìm tất cả các thẻ div hoặc a nằm ở đầu trang (trước thẻ h1)
    const bodyChildren = Array.from(document.body.children);
    let foundH1 = false;
    
    for (let el of bodyChildren) {
        if (el.tagName === 'H1') {
            foundH1 = true; // Đã đến phần nội dung chính
            break;
        }
        // Nếu là các thẻ rác của thanh menu cũ (div, a, span) thì xóa
        if (el.tagName === 'DIV' || el.tagName === 'A' || el.tagName === 'SPAN') {
            el.remove();
        }
    }

    // Nếu không tìm thấy H1 (ví dụ trang chủ), ta tìm và xóa riêng thanh progress bar
    if (!foundH1) {
        const oldBar = document.querySelector('.chapter-progress-bar');
        if (oldBar) oldBar.remove();
    }

    // 2. TẠO THANH MENU MỚI TINH
    const navHTML = `
        <nav class="top-nav">
            <a href="index.html" class="nav-item">Trang chủ</a>
            <a href="chuong1.html" class="nav-item">C1: Giới thiệu</a>
            <a href="chuong2.html" class="nav-item">C2: Biến & DL</a>
            <a href="chuong3.html" class="nav-item">C3: Điều kiện</a>
            <a href="chuong4.html" class="nav-item">C4: Vòng lặp</a>
            <a href="chuong5.html" class="nav-item">C5: Hàm</a>
            <a href="chuong6.html" class="nav-item">C6: Mảng & Chuỗi</a>
            <a href="cuoiki.html" class="nav-item">Thi cuối kỳ</a>
        </nav>
    `;

    // Chèn thanh menu vào ngay trước thẻ H1 đầu tiên
    const firstHeading = document.querySelector('h1');
    if (firstHeading) {
        firstHeading.insertAdjacentHTML('beforebegin', navHTML);
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }

    // 3. LÀM NỔI BẬT NÚT ĐANG CHỌN (Active)
    let path = window.location.pathname;
    let filename = path.substring(path.lastIndexOf('/') + 1);
    if (!filename || filename === '') filename = 'index.html'; // Mặc định là trang chủ

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('href') === filename) {
            item.classList.add('active');
        }
    });

    // 4. THÊM NÚT COPY CHO CODE (Tự động nhận diện code C++)
    const preBlocks = document.querySelectorAll('pre');
    preBlocks.forEach(block => {
        const text = block.innerText;
        
        // Bỏ qua các sơ đồ ASCII (không chứa các từ khóa code C++)
        if (!text.includes('#include') && !text.includes('int main') && !text.includes('cout') && !text.includes('for(') && !text.includes('while(')) {
            return; 
        }

        const btn = document.createElement('button');
        btn.textContent = 'Copy';
        btn.style.cssText = `
            position: absolute; top: 10px; right: 10px;
            background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);
            padding: 5px 12px; border-radius: 6px; cursor: pointer;
            font-size: 12px; transition: all 0.2s; font-family: sans-serif; font-weight: 600;
        `;
        
        btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.25)';
        btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.1)';
        
        btn.onclick = () => {
            // Lấy text gốc, cắt bỏ chữ 'Copy' nếu lỡ bị dính vào
            const codeText = block.innerText.replace('Copy', '').trim(); 
            navigator.clipboard.writeText(codeText).then(() => {
                btn.textContent = 'Đã copy ✓';
                btn.style.background = '#10b981'; // Xanh lá
                btn.style.borderColor = '#10b981';
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.style.background = 'rgba(255,255,255,0.1)';
                    btn.style.borderColor = 'rgba(255,255,255,0.2)';
                }, 2000);
            });
        };
        // Đảm bảo thẻ pre có position: relative để nút Copy không bị trôi
        block.style.position = 'relative'; 
        block.appendChild(btn);
    });
});