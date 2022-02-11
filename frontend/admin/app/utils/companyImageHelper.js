export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function imageEncode(arrayBuffer) {
  let u8 = new Uint8Array(arrayBuffer);
  let b64encoded = btoa(
    [].reduce.call(
      new Uint8Array(arrayBuffer),
      function(p, c) {
        return p + String.fromCharCode(c);
      },
      '',
    ),
  );
  let mimetype = 'image/jpeg';
  return 'data:' + mimetype + ';base64,' + b64encoded;
}

