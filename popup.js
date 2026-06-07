document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scanBtn');
  const status = document.getElementById('status');
  const result = document.getElementById('result');
  const urlInput = document.getElementById('urlInput');
  const openBtn = document.getElementById('openBtn');
  const hint = document.getElementById('hint');

  let currentUrl = null;

  scanBtn.addEventListener('click', async () => {
    scanBtn.disabled = true;
    status.textContent = 'スキャン中...';
    status.className = 'status';
    result.classList.add('hidden');
    openBtn.classList.add('hidden');
    hint.textContent = '';
    currentUrl = null;

    try {
      // タブのスクリーンショットを取得
      const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });

      // 画像を読み込んでQRコードをスキャン
      const qrData = await scanQRCode(dataUrl);

      if (qrData) {
        status.textContent = 'QRコードを検出しました！';
        status.className = 'status success';
        urlInput.value = qrData;
        result.classList.remove('hidden');

        currentUrl = parseHttpUrl(qrData);
        if (currentUrl) {
          openBtn.classList.remove('hidden');
          hint.textContent = 'Enterキーまたはボタンで新規タブを開けます。';
        } else {
          hint.textContent = 'URLではないため、自動では開きません。';
        }

        urlInput.focus();
        urlInput.select();
      } else {
        status.textContent = 'QRコードが見つかりませんでした';
        status.className = 'status error';
      }
    } catch (error) {
      console.error('Error:', error);
      status.textContent = 'エラー: ' + error.message;
      status.className = 'status error';
    } finally {
      scanBtn.disabled = false;
    }
  });

  openBtn.addEventListener('click', () => {
    openCurrentUrl();
  });

  // Enterキーで新規タブを開く
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      openCurrentUrl();
    }
  });

  function openCurrentUrl() {
    if (!currentUrl) return;
    chrome.tabs.create({ url: currentUrl });
    window.close();
  }
});

function parseHttpUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}

// QRコードをスキャンする関数
async function scanQRCode(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // jsQRを使用してQRコードをデコード
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        resolve(code.data);
      } else {
        // 反転も試す
        const codeInverted = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'onlyInvert',
        });
        if (codeInverted) {
          resolve(codeInverted.data);
        } else {
          resolve(null);
        }
      }
    };
    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    img.src = dataUrl;
  });
}
