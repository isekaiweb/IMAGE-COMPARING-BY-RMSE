//pembuatan element dengan menggunakan class
class Data {
  constructor(canvas, src) {
    this.canvas = canvas;
    this.src = src;

    this.context = this.canvas.getContext("2d");
    this.img = new Image();
    this.src.addEventListener("change", () => {
      this.img.src = this.src.value.split("\\").pop();
      this.img.onload = () => {
        this.context.drawImage(
          this.img,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        this.getRGB();
      };
    });
  }

  //fungsi untuk mengambil nilai rgba
  getRGB() {
    const rgba = { r: [], g: [], b: [], a: [] },
      pixelData = this.context.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

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
  btn = document.querySelector("button");

let data1 = new Data(canvas[0], src[0]),
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

  return Math.sqrt((red + blue + green + alpha) / (img1.r.length * 16777216)); //angka disesuaikan sebelumnya 4
}

src[0].onclick = () => {
  if (src[0].value != "") {
    canvas[0]
      .getContext("2d")
      .clearRect(0, 0, canvas[0].width, canvas[0].height);
    src[0].value = "";
  }
};
src[1].onclick = () => {
  if (src[1].value != "") {
    canvas[1]
      .getContext("2d")
      .clearRect(0, 0, canvas[1].width, canvas[1].height);
    src[1].value = "";
  }
};

///ketika tombol btn diklik
btn.addEventListener("click", () => {
  if (src[0].value == "" || src[1].value == "") {
    alert("Pilih Kedua Gambar Terlebih Dahulu");
    return false;
  } else {
    src.forEach((i) => (i.style.display = "none"));
    if (hasilRMSE() == 0) {
      btn.innerHTML = "Sama";
    } else if (hasilRMSE() <= 0.01) {
      btn.innerHTML = "Mirip";
    } else {
      {
        btn.innerHTML = "Beda";
      }
    }
  }

  setTimeout(() => {
    btn.innerHTML = "Compare";
    src.forEach((i) => {
      i.style.display = "block";
      i.value = "";
    });
    canvas.forEach((i) => {
      i.getContext("2d").clearRect(0, 0, i.width, i.height);
    });
  }, 3000);
});
