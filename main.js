//pembuatan element dengan menggunakan class
class Data {
  constructor(canvas, src) {
    this.canvas = canvas;
    this.src = src;
    this.img = new Image();
    this.ctx = this.canvas.getContext("2d");

    this.img.addEventListener("load", () => {
      this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
      this.getRGB();
    });
    this.src.addEventListener("change", (e) => this.createImg(e));
    this.src.addEventListener("click", () => this.removeImg());
  }

  createImg(e) {
    this.img.src = URL.createObjectURL(e.target.files[0]);
  }

  removeImg() {
    if (this.src.value != "") {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.src.value = "";
    }
  }

  //fungsi untuk mengambil nilai rgba
  getRGB() {
    const rgba = { r: [], g: [], b: [], a: [] },
      pixelData = this.canvas
        .getContext("2d")
        .getImageData(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < pixelData.data.length; i += 4) {
      rgba.r.push(pixelData.data[i]);
      rgba.g.push(pixelData.data[i + 1]);
      rgba.b.push(pixelData.data[i + 2]);
      rgba.a.push(pixelData.data[i + 3]);
    }

    return rgba;
  }
}

const canvas = document.querySelectorAll("canvas"),
  src = document.querySelectorAll("input[type=file]"),
  btn = document.querySelector("button"),
  data1 = new Data(canvas[0], src[0]),
  data2 = new Data(canvas[1], src[1]);

function hasilRMSE() {
  const img1 = data1.getRGB(),
    img2 = data2.getRGB();

  let red = 0,
    blue = 0,
    green = 0,
    alpha = 0;

  for (let i = 0; i < img1.r.length; i++) {
    red += Math.pow(Math.abs(img1.r[i] - img2.r[i]), 2);
    blue += Math.pow(Math.abs(img1.b[i] - img2.b[i]), 2);
    green += Math.pow(Math.abs(img1.g[i] - img2.g[i]), 2);
    alpha += Math.pow(Math.abs(img1.a[i] - img2.a[i]), 2);
  }

  return Math.sqrt((red + blue + green + alpha) / (img1.r.length * 4)); //angka disesuaikan sebelumnya 4
}

///ketika tombol btn diklik
btn.addEventListener("click", () => {
  let hasil = hasilRMSE();
  if (src[0].value == "" || src[1].value == "") {
    alert("Pilih Kedua Gambar Terlebih Dahulu");
    return false;
  } else {
    src.forEach((i) => (i.style.display = "none"));
    if (hasil == 0) {
      btn.innerHTML = "Sama";
    } else if (hasil <= 0.01) {
      btn.innerHTML = "Mirip";
    } else {
      {
        btn.innerHTML = "Beda";
      }
    }
    const h1 = document.querySelector("h1");
    h1.innerHTML = `RMSE = ${hasil}`;
    setTimeout(() => {
      btn.innerHTML = "Compare";
      src.forEach((i) => {
        i.style.display = "block";
        i.value = "";
        h1.innerHTML = `COMPARING TWO IMAGES WITH RSME`;
      });
      canvas.forEach((i) => {
        i.getContext("2d").clearRect(0, 0, i.width, i.height);
      });
    }, 3000);
  }
});
