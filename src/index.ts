import './reset.scss';
import './index.scss';

const advertisingDom = document.querySelector<HTMLDivElement>('.advertising');
const pcImgDom = document.querySelector<HTMLImageElement>('.sticky-container .pc-img');

document.addEventListener<'scroll'>('scroll', () => {
  if (advertisingDom && document.documentElement.scrollTop <= 260) {
    advertisingDom.style.opacity = (1 - document.documentElement.scrollTop / 260).toString();
  }
  if (pcImgDom && document.documentElement.scrollTop <= 600) {
    pcImgDom.src = `./image/large_${Math.floor((document.documentElement.scrollTop / 600) * 120)
      .toString()
      .padStart(4, '0')}.jpg`;
  }
});
