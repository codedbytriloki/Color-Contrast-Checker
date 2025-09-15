function clampHex(hex){
  hex = hex.replace("#", "");
  if(hex.length === 3){
    hex = hex.split("").map(c => c + c).join("");
  }
  return "#" + hex.padEnd(6, "0");
}

// convert hex -->RGB
const hexToRgb = hex => {
  hex = hex.replace("#","");
  const r = parseInt(hex.slice(0,2), 16);
  const g = parseInt(hex.slice(2,4), 16);
  const b = parseInt(hex.slice(4,6), 16);
  return [r,g,b];
}

const channel = v => {
  v /= 255;
  return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
};
const luminance = ([r,g,b]) => 
  0.2126*channel(r) + 0.7152*channel(g) + 0.0722*channel(b);


function contrastRatio(c1, c2){
  const L1 = luminance(hexToRgb(c1));
  const L2 = luminance(hexToRgb(c2));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05); 
}

const textColorPicker = document.getElementById("textColorPicker");
const bgColorPicker = document.getElementById("bgColorPicker");
const textHex = document.getElementById("textHex");
const bgHex = document.getElementById("bgHex");
const fontSize = document.getElementById("fontSize");
const fontSizeValue = document.getElementById("fontSizeValue");
const fontWeight = document.getElementById("fontWeight");
const randomBtn = document.getElementById("randomBtn");
const ratioText = document.getElementById("ratio");
const aaNormal = document.getElementById("aaNormal");
const aaaNormal = document.getElementById("aaaNormal");
const aaLarge = document.getElementById("aaLarge");
const aaaLarge = document.getElementById("aaaLarge");
const previewBox = document.getElementById("previewBox");

function update(){
  const tColor = clampHex(textHex.value);
  const bColor = clampHex(bgHex.value);

  textColorPicker.value = tColor;
  bgColorPicker.value = bColor;

  previewBox.style.color = tColor;
  previewBox.style.background = bColor;
  previewBox.style.fontSize = fontSize.value + "px";
  previewBox.style.fontWeight = fontWeight.value;

  fontSizeValue.textContent = fontSize.value + "px";

  const ratio = contrastRatio(tColor, bColor).toFixed(2);
  ratioText.textContent = ratio;

  const size = parseInt(fontSize.value);
  const bold = fontWeight.value === "bold";
  const largeText = size >= 24 || (bold && size >= 18.66);

  aaNormal.textContent = ratio >= 4.5 ? "Pass" : "Fail";
  aaLarge.textContent = ratio >= 3 ? "Pass" : "Fail";
  aaaNormal.textContent = ratio >= 7 ? "Pass" : "Fail";
  aaaLarge.textContent = ratio >= 4.5 ? "Pass" : "Fail";
}

function randomColor(){
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0");
}

randomBtn.addEventListener('click', () => {
  textHex.value = randomColor();
  bgHex.value = randomColor();
  update();
})

[textHex, bgHex, fontSize, fontWeight].forEach(el => {
  if(el){
    el.addEventListener("input", update);
  }
});

textColorPicker.addEventListener("input", () => {
  textHex.value = textColorPicker.value;
  update();
})

bgColorPicker.addEventListener("input", () => {
  bgHex.value = bgColorPicker.value;
  update();
})

update();