import './reset.scss';
import './index.scss';
const CANVAS_WIDTH: number = window.innerWidth * 0.7;
const CANVAS_HEIGHT: number = (window.innerHeight * CANVAS_WIDTH) / (window.innerWidth - 15);

const advertisingDom = document.querySelector<HTMLDivElement>('.advertising');
const stickyContainerDom = document.querySelector<HTMLDivElement>('.sticky-container');
const pcImgDom = stickyContainerDom?.querySelector<HTMLImageElement>('.pc-img');

const scaleCanvasDom = document.querySelector<HTMLCanvasElement>('.scale-image .canvas');
const pcBgDom = document.querySelector<HTMLDivElement>('.scale-image .pc-bg');
let scaleCanvasDomTop: number = 0;
let image1: HTMLImageElement | undefined;
let image2: HTMLImageElement | undefined;
// image1.src = './image/mac1.jpg';
// image2.src = './image/mac2.jpg';

function createdImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image: HTMLImageElement = new Image();
    image.onload = (): void => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function pcScrollHandler(scrollTop: number): void {
  if (advertisingDom && scrollTop <= 260) {
    advertisingDom.style.opacity = (1 - scrollTop / 260).toString();
  }
  if (stickyContainerDom && pcImgDom && scrollTop <= 600) {
    stickyContainerDom.style.position = 'sticky';
    stickyContainerDom.style.top = '100px';
    pcImgDom.src = `./image/large_${Math.floor((scrollTop / 600) * 120)
      .toString()
      .padStart(4, '0')}.jpg`;
  }
  if (stickyContainerDom && scrollTop > 600) {
    stickyContainerDom.style.position = 'absolute';
    stickyContainerDom.style.top = '500px';
  }
}

function drawImage(scrollTop: number): void {
  if (scaleCanvasDom && image1 && image2) {
    const top: number = scrollTop - scaleCanvasDomTop;
    const ctx = scaleCanvasDom.getContext('2d');
    ctx?.drawImage(image1, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx?.drawImage(
      image2,
      0,
      image2.height - top,
      // window.innerWidth - 15,
      image2.width,
      top,
      0,
      ((window.innerWidth - 15) / CANVAS_WIDTH) * CANVAS_HEIGHT - top - 150,
      CANVAS_WIDTH,
      top
    );
  }
}

function scaleScrollHandler(scrollTop: number): void {
  if (scaleCanvasDom && pcBgDom) {
    const top: number = scaleCanvasDomTop - scrollTop;
    if (top >= 0 && top <= window.innerHeight / 2) {
      window.innerWidth / CANVAS_WIDTH;
      const power: number =
        ((((window.innerWidth - 15) / CANVAS_WIDTH - 1) * (window.innerHeight / 2 - top)) /
          window.innerHeight) *
        2;
      const curScale: number = 1 + power;
      const translate: number = (power * CANVAS_HEIGHT) / 2;
      pcBgDom.style.transform = `matrix(${curScale}, 0, 0, ${curScale}, 0, ${translate})`;
    } else if (top < 0 && top >= -window.innerHeight) {
      const curScale: number = (window.innerWidth - 15) / CANVAS_WIDTH;
      pcBgDom.style.transform = `matrix(${curScale}, 0, 0, ${curScale}, 0, ${
        ((curScale - 1) * CANVAS_HEIGHT) / 2
      }`;
      drawImage(scrollTop);
      pcBgDom.classList.remove('show-image');
    } else if (top < 0 && top >= -window.innerHeight - window.innerHeight / 2) {
      const power: number =
        ((((window.innerWidth - 15) / CANVAS_WIDTH - 1) *
          (window.innerHeight / 2 - (-top - window.innerHeight))) /
          window.innerHeight) *
        2;
      const curScale: number = 1 + power;
      const translate: number =
        power * (CANVAS_HEIGHT / 2) + ((70 * (-top - window.innerHeight)) / window.innerHeight) * 2;
      pcBgDom.style.transform = `matrix(${curScale}, 0, 0, ${curScale}, 0, ${translate})`;
      pcBgDom.classList.add('show-image');
    }
  }
}

// async function test(): Promise<void> {
//   console.log('asd');
//   const [img1, img2] = await Promise.all([
//     createdImage('./image/mac1.jpg'),
//     createdImage('./image/mac2.jpg')
//   ]);
//   console.log('bb');
//   const testCanvas = document.querySelector<HTMLCanvasElement>('.test');
//   console.log(testCanvas);
//   if (testCanvas) {
//     testCanvas.width = CANVAS_WIDTH;
//     testCanvas.height = CANVAS_HEIGHT;
//     const ctx = testCanvas.getContext('2d');
//     ctx?.drawImage(img1, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//     // ctx?.drawImage(
//     //   img2,
//     //   0,
//     //   CANVAS_HEIGHT - 100,
//     //   CANVAS_WIDTH,
//     //   100,
//     //   0,
//     //   CANVAS_HEIGHT - 100,
//     //   CANVAS_WIDTH,
//     //   CANVAS_HEIGHT
//     // );
//     ctx?.drawImage(img2, 0, img2.height - 300, img2.width, 300, 0, 0, CANVAS_WIDTH, 300);
//   }
// }

async function init(): Promise<void> {
  [image1, image2] = await Promise.all([
    createdImage('./image/mac1.jpg'),
    createdImage('./image/mac2.jpg')
  ]);
  if (scaleCanvasDom) {
    scaleCanvasDom.width = CANVAS_WIDTH;
    scaleCanvasDom.height = CANVAS_HEIGHT;
    const rect = scaleCanvasDom.getBoundingClientRect();
    scaleCanvasDomTop = rect.top + document.documentElement.scrollTop;

    const ctx = scaleCanvasDom.getContext('2d');
    ctx?.drawImage(image1, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // image2.onload = (): void => {
    //   ctx?.drawImage(image2, 0, 0);
    // };
  }
}

document.addEventListener<'scroll'>('scroll', () => {
  pcScrollHandler(document.documentElement.scrollTop);
  scaleScrollHandler(document.documentElement.scrollTop);
});

init();
console.log('test');
// test();
